"""
Test Stripe Connection
This script tests if your Stripe credentials are working correctly.
"""

from dotenv import load_dotenv
import os
import stripe

# Load environment variables
load_dotenv()

print("=" * 70)
print("TESTING STRIPE CONNECTION")
print("=" * 70)
print()

# Get credentials
secret_key = os.getenv('STRIPE_SECRET_KEY')
publishable_key = os.getenv('STRIPE_PUBLISHABLE_KEY')
price_id = os.getenv('STRIPE_PRICE_ID')

# Check if loaded
print("1. Checking Environment Variables:")
print(f"   Secret Key: {'✓ Found (' + secret_key[:20] + '...)' if secret_key else '✗ NOT FOUND'}")
print(f"   Publishable Key: {'✓ Found (' + publishable_key[:20] + '...)' if publishable_key else '✗ NOT FOUND'}")
print(f"   Price ID: {'✓ Found (' + price_id + ')' if price_id else '✗ NOT FOUND'}")
print()

if not secret_key:
    print("✗ ERROR: Secret key not found in .env file!")
    print("  Make sure your .env file has: STRIPE_SECRET_KEY=sk_test_...")
    exit(1)

# Set Stripe API key
stripe.api_key = secret_key

print("2. Testing Stripe API Connection:")
try:
    # Try to retrieve the price
    price = stripe.Price.retrieve(price_id)
    print(f"   ✓ Successfully connected to Stripe!")
    print(f"   ✓ Price retrieved: {price.unit_amount / 100} {price.currency.upper()}")
    print(f"   ✓ Product: {price.product}")
    print()
    print("=" * 70)
    print("✅ ALL TESTS PASSED!")
    print("=" * 70)
    print()
    print("Your Stripe credentials are working correctly.")
    print("You can now run: python stripe_server.py")
    print()
    
except stripe.error.InvalidRequestError as e:
    print(f"   ✗ Error: {e}")
    print()
    print("   This usually means:")
    print("   - The Price ID is incorrect")
    print("   - The price doesn't exist in your Stripe account")
    print("   - You're using a test key with a live price (or vice versa)")
    print()
    print("   Check your Price ID in: https://dashboard.stripe.com/test/products")
    
except stripe.error.AuthenticationError as e:
    print(f"   ✗ Authentication Error: {e}")
    print()
    print("   This means your Secret Key is invalid.")
    print("   Get a new one from: https://dashboard.stripe.com/test/apikeys")
    
except Exception as e:
    print(f"   ✗ Unexpected Error: {e}")
    print()
    print("   Please check your Stripe Dashboard for more details.")
