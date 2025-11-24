import os
import sys
from dotenv import load_dotenv

print(f"Python: {sys.version}")

try:
    import stripe
    print(f"Stripe imported from: {stripe.__file__}")
    print(f"Stripe version: {getattr(stripe, 'version', 'Unknown')}")
    print(f"Dir(stripe): {dir(stripe)[:20]}...")
    
    print(f"stripe.checkout type: {type(stripe.checkout)}")
    
    if hasattr(stripe.checkout, 'Session'):
        print("stripe.checkout.Session exists")
    else:
        print("stripe.checkout.Session DOES NOT EXIST")

except Exception as e:
    print(f"Error inspecting stripe: {e}")

load_dotenv()
print(f"Secret Key present: {'Yes' if os.environ.get('STRIPE_SECRET_KEY') else 'No'}")
