"""
Setup Environment Variables - Interactive Script
This script helps you create your .env file securely.
"""

import secrets

print("=" * 70)
print("STRIPE ENVIRONMENT SETUP (TEST MODE)")
print("=" * 70)
print()

# Generate a secure Flask secret key
flask_secret = secrets.token_hex(32)

print("I'll help you create your .env file with the credentials you need.")
print()

# The TEST publishable key you provided
publishable_key = "pk_test_51Q5FxyE8RPwVq1YZ01tRrTHRImC7v6Sti4OG3dBOprO6PJyW74mkxwrjNyTXdl0xsNyrn5tIcgcPiYAzsbKtImyb00UgK4ctXS"

print("✓ Publishable Key (TEST MODE - already provided):")
print(f"  {publishable_key[:30]}...")
print()

print("✓ USING TEST MODE:")
print("  This is safe for development. No real charges will be made.")
print("  You can test with card: 4242 4242 4242 4242")
print()

print("-" * 70)
print("NEXT: You need to provide your Stripe TEST SECRET KEY")
print("-" * 70)
print()
print("1. Go to: https://dashboard.stripe.com/test/apikeys")
print("2. Make sure you're in TEST mode (toggle in top right)")
print("3. Find your 'Secret key' (starts with sk_test_...)")
print("4. Click 'Reveal test key token'")
print("5. Copy the key")
print()

secret_key = input("Paste your Stripe TEST Secret Key here: ").strip()

if not secret_key:
    print("No key provided. Using placeholder.")
    secret_key = "sk_test_YOUR_SECRET_KEY_HERE"
elif not secret_key.startswith('sk_test_'):
    print()
    print("⚠️ WARNING: This doesn't look like a TEST secret key.")
    print("   Test keys start with 'sk_test_'")
    print("   Live keys start with 'sk_live_'")
    print()
    confirm = input("Continue anyway? (yes/no): ").strip().lower()
    if confirm != 'yes':
        print("Setup cancelled. Run this script again when ready.")
        exit()

print()
print("-" * 70)
print("NEXT: You need to provide your Stripe PRICE ID")
print("-" * 70)
print()
print("1. Go to: https://dashboard.stripe.com/test/products")
print("2. Make sure you're in TEST mode")
print("3. Click 'Add product' (or select existing product)")
print("4. Set name: 'Premium Resources' (or your choice)")
print("5. Set price: $97.00 USD (or your price)")
print("6. Click 'Save product'")
print("7. Copy the 'Price ID' (starts with price_...)")
print()

price_id = input("Paste your Stripe Price ID here: ").strip()

if not price_id:
    print("No price ID provided. Using placeholder.")
    price_id = "price_YOUR_PRICE_ID_HERE"
elif not price_id.startswith('price_'):
    print()
    print("⚠️ WARNING: This doesn't look like a price ID.")
    print("   Price IDs start with 'price_'")
    print()
    confirm = input("Continue anyway? (yes/no): ").strip().lower()
    if confirm != 'yes':
        print("Setup cancelled. Run this script again when ready.")
        exit()

print()
print("-" * 70)
print("DOMAIN CONFIGURATION")
print("-" * 70)
print()
print("For local testing, use: http://localhost:5000")
print("For production, use: https://yourdomain.com")
print()

domain = input("Enter your domain [http://localhost:5000]: ").strip()
if not domain:
    domain = "http://localhost:5000"

print()
print("=" * 70)
print("CREATING .ENV FILE")
print("=" * 70)
print()

env_content = f"""# Stripe Configuration (TEST MODE)
# ⚠️ KEEP THIS FILE SECRET - NEVER COMMIT TO GIT ⚠️

# Stripe Keys (TEST MODE)
STRIPE_PUBLISHABLE_KEY={publishable_key}
STRIPE_SECRET_KEY={secret_key}
STRIPE_PRICE_ID={price_id}

# Webhook Secret (add later when setting up webhooks - optional for testing)
STRIPE_WEBHOOK_SECRET=

# Flask Configuration
FLASK_SECRET_KEY={flask_secret}

# Domain
DOMAIN={domain}
"""

try:
    with open('.env', 'w') as f:
        f.write(env_content)
    
    print("✓ .env file created successfully!")
    print()
    print("Your configuration:")
    print(f"  - Mode: TEST MODE (safe for development)")
    print(f"  - Publishable Key: {publishable_key[:30]}...")
    print(f"  - Secret Key: {secret_key[:20]}...")
    print(f"  - Price ID: {price_id}")
    print(f"  - Domain: {domain}")
    print(f"  - Flask Secret: (auto-generated)")
    print()
    print("=" * 70)
    print("NEXT STEPS")
    print("=" * 70)
    print()
    print("1. Add your PDF files to: Resources/protected_pdfs/")
    print("2. Run pre-flight check: python check_setup.py")
    print("3. Start the server: python stripe_server.py")
    print("4. Visit: " + domain)
    print()
    print("🧪 TEST CARD:")
    print("  Card: 4242 4242 4242 4242")
    print("  Expiry: Any future date (e.g., 12/25)")
    print("  CVC: Any 3 digits (e.g., 123)")
    print("  ZIP: Any 5 digits (e.g., 12345)")
    print()
    print("✓ Setup complete! You're ready to test.")
    print()
    
except Exception as e:
    print(f"✗ Error creating .env file: {e}")
    print()
    print("You can manually create .env file with this content:")
    print()
    print(env_content)
