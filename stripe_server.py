import os
import json
import secrets
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, render_template, redirect, url_for, session, send_from_directory
from flask_cors import CORS
import stripe
import stripe.checkout
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_SECRET_KEY', secrets.token_hex(32))
CORS(app)

# Stripe configuration
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')
STRIPE_PUBLISHABLE_KEY = os.environ.get('STRIPE_PUBLISHABLE_KEY')
STRIPE_PRICE_ID = os.environ.get('STRIPE_PRICE_ID')  # Your Stripe Price ID
STRIPE_WEBHOOK_SECRET = os.environ.get('STRIPE_WEBHOOK_SECRET')

# Debug: Print configuration status (remove in production)
print("=" * 60)
print("STRIPE CONFIGURATION STATUS:")
print(f"Secret Key: {'✓ Loaded' if stripe.api_key else '✗ NOT FOUND'}")
print(f"Publishable Key: {'✓ Loaded' if STRIPE_PUBLISHABLE_KEY else '✗ NOT FOUND'}")
print(f"Price ID: {STRIPE_PRICE_ID if STRIPE_PRICE_ID else '✗ NOT FOUND'}")
print("=" * 60)

# Configuration
DOMAIN = os.environ.get('DOMAIN', 'http://localhost:5000')
PDF_FOLDER = os.path.join(os.path.dirname(__file__), 'Resources', 'protected_pdfs')
ACCESS_DURATION_DAYS = 365  # How long access lasts after purchase

# Simple in-memory storage (use a database in production)
# Format: {email: {'access_token': token, 'expires': datetime, 'session_id': session_id}}
user_access = {}


@app.route('/')
def index():
    """Home page with buy button"""
    return render_template('buy_button.html', 
                         publishable_key=STRIPE_PUBLISHABLE_KEY,
                         price_id=STRIPE_PRICE_ID)

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files from the root directory"""
    return send_from_directory('.', filename)


@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    """Create a Stripe Checkout session"""
    try:
        data = request.get_json()
        email = data.get('email')
        
        checkout_session = stripe.checkout.Session.create(
            customer_email=email,
            payment_method_types=['card'],
            line_items=[{
                'price': STRIPE_PRICE_ID,
                'quantity': 1,
            }],
            mode='payment',
            success_url=DOMAIN + '/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url=DOMAIN + '/cancel',
            metadata={
                'customer_email': email
            }
        )
        
        return jsonify({'sessionId': checkout_session.id})
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"DEBUG: stripe type: {type(stripe)}")
        try:
            print(f"DEBUG: stripe.checkout type: {type(stripe.checkout)}")
        except:
            print("DEBUG: stripe.checkout access failed")
        return jsonify({'error': str(e)}), 403


@app.route('/success')
def success():
    """Success page after payment"""
    session_id = request.args.get('session_id')
    
    if not session_id:
        return redirect(url_for('index'))
    
    try:
        # Retrieve the session from Stripe
        checkout_session = stripe.checkout.Session.retrieve(session_id)
        
        if checkout_session.payment_status == 'paid':
            email = checkout_session.customer_email
            
            # Generate access token
            access_token = secrets.token_urlsafe(32)
            expires = datetime.now() + timedelta(days=ACCESS_DURATION_DAYS)
            
            # Store user access
            user_access[email] = {
                'access_token': access_token,
                'expires': expires,
                'session_id': session_id
            }
            
            # Set session
            session['email'] = email
            session['access_token'] = access_token
            
            return render_template('success.html', 
                                 email=email,
                                 access_token=access_token)
        else:
            return redirect(url_for('index'))
            
    except Exception as e:
        print(f"Error: {e}")
        return redirect(url_for('index'))


@app.route('/cancel')
def cancel():
    """Cancel page"""
    return render_template('cancel.html')


@app.route('/access')
def access_pdfs():
    """Access page for authenticated users"""
    email = session.get('email')
    access_token = session.get('access_token')
    
    # Check if user is authenticated
    if not email or not access_token:
        return redirect(url_for('login'))
    
    # Verify access token
    user_data = user_access.get(email)
    if not user_data or user_data['access_token'] != access_token:
        return redirect(url_for('login'))
    
    # Check if access has expired
    if datetime.now() > user_data['expires']:
        return render_template('expired.html')
    
    # Get list of PDFs
    pdf_files = []
    if os.path.exists(PDF_FOLDER):
        pdf_files = [f for f in os.listdir(PDF_FOLDER) if f.endswith('.pdf')]
    
    return render_template('access.html', 
                         email=email,
                         pdf_files=pdf_files,
                         expires=user_data['expires'].strftime('%B %d, %Y'))


@app.route('/login', methods=['GET', 'POST'])
def login():
    """Login page for returning customers"""
    if request.method == 'POST':
        email = request.form.get('email')
        access_token = request.form.get('access_token')
        
        user_data = user_access.get(email)
        if user_data and user_data['access_token'] == access_token:
            if datetime.now() <= user_data['expires']:
                session['email'] = email
                session['access_token'] = access_token
                return redirect(url_for('access_pdfs'))
            else:
                return render_template('login.html', error='Your access has expired.')
        else:
            return render_template('login.html', error='Invalid credentials.')
    
    return render_template('login.html')


@app.route('/download/<filename>')
def download_pdf(filename):
    """Download a PDF file"""
    email = session.get('email')
    access_token = session.get('access_token')
    
    # Verify authentication
    if not email or not access_token:
        return "Unauthorized", 401
    
    user_data = user_access.get(email)
    if not user_data or user_data['access_token'] != access_token:
        return "Unauthorized", 401
    
    if datetime.now() > user_data['expires']:
        return "Access expired", 403
    
    # Security: prevent directory traversal
    if '..' in filename or '/' in filename or '\\' in filename:
        return "Invalid filename", 400
    
    return send_from_directory(PDF_FOLDER, filename, as_attachment=True)


@app.route('/webhook', methods=['POST'])
def webhook():
    """Stripe webhook endpoint"""
    payload = request.data
    sig_header = request.headers.get('Stripe-Signature')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        return 'Invalid payload', 400
    except stripe.error.SignatureVerificationError as e:
        return 'Invalid signature', 400
    
    # Handle the checkout.session.completed event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        # Fulfill the purchase
        email = session.get('customer_email')
        session_id = session.get('id')
        
        if email and session_id:
            access_token = secrets.token_urlsafe(32)
            expires = datetime.now() + timedelta(days=ACCESS_DURATION_DAYS)
            
            user_access[email] = {
                'access_token': access_token,
                'expires': expires,
                'session_id': session_id
            }
            
            # Here you could send an email with the access token
            print(f"Access granted to {email}")
    
    return jsonify({'status': 'success'})


@app.route('/logout')
def logout():
    """Logout user"""
    session.clear()
    return redirect(url_for('index'))


if __name__ == '__main__':
    # Create PDF folder if it doesn't exist
    os.makedirs(PDF_FOLDER, exist_ok=True)
    
    # Run the app
    app.run(debug=True, port=5000)
