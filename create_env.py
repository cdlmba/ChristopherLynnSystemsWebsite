"""
Quick .env Generator
This creates your .env file with the test publishable key already configured.
You just need to add your Secret Key and Price ID.
"""

import secrets

# Generate Flask secret key
flask_secret = secrets.token_hex(32)

# Your test publishable key (already provided)
publishable_key = "pk_test_51Q5FxyE8RPwVq1YZ01tRrTHRImC7v6Sti4OG3dBOprO6PJyW74mkxwrjNyTXdl0xsNyrn5tIcgcPiYAzsbKtImyb00UgK4ctXS"

env_content = f"""# Stripe Configuration (TEST MODE)
# ⚠️ KEEP THIS FILE SECRET - NEVER COMMIT TO GIT ⚠️

# ============================================================================
# STRIPE KEYS (TEST MODE)
# ============================================================================

# Publishable Key (already configured - TEST MODE)
STRIPE_PUBLISHABLE_KEY={publishable_key}

# Secret Key - ADD YOUR TEST SECRET KEY HERE
# Get it from: https://dashboard.stripe.com/test/apikeys
# Click "Reveal test key token" and paste it below (starts with sk_test_...)
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE

# Price ID - ADD YOUR PRICE ID HERE
# Get it from: https://dashboard.stripe.com/test/products
# Create a product, then copy the Price ID (starts with price_...)
STRIPE_PRICE_ID=price_YOUR_PRICE_ID_HERE

# Webhook Secret (optional for local testing)
STRIPE_WEBHOOK_SECRET=

# ============================================================================
# FLASK CONFIGURATION
# ============================================================================

# Flask Secret Key (auto-generated - DO NOT CHANGE)
FLASK_SECRET_KEY={flask_secret}

# ============================================================================
# DOMAIN CONFIGURATION
# ============================================================================

# For local testing
DOMAIN=http://localhost:5000

# For production (when ready), change to:
# DOMAIN=https://yourdomain.com

# ============================================================================
# INSTRUCTIONS
# ============================================================================
# 1. Replace "sk_test_YOUR_SECRET_KEY_HERE" with your actual Stripe test secret key
# 2. Replace "price_YOUR_PRICE_ID_HERE" with your actual Stripe price ID
# 3. Save this file
# 4. Run: python check_setup.py
# 5. Run: python stripe_server.py
# ============================================================================
"""

try:
    with open('.env', 'w', encoding='utf-8') as f:
        f.write(env_content)
    
    print("=" * 70)
    print("✓ .ENV FILE CREATED SUCCESSFULLY!")
    print("=" * 70)
    print()
    print("Your .env file has been created with:")
    print(f"  ✓ Test Publishable Key: {publishable_key[:30]}...")
    print(f"  ✓ Flask Secret Key: (auto-generated)")
    print(f"  ✓ Domain: http://localhost:5000")
    print()
    print("=" * 70)
    print("⚠️ YOU STILL NEED TO ADD:")
    print("=" * 70)
    print()
    print("1. STRIPE SECRET KEY (sk_test_...)")
    print("   - Go to: https://dashboard.stripe.com/test/apikeys")
    print("   - Make sure you're in TEST mode")
    print("   - Click 'Reveal test key token'")
    print("   - Copy and paste into .env file")
    print()
    print("2. STRIPE PRICE ID (price_...)")
    print("   - Go to: https://dashboard.stripe.com/test/products")
    print("   - Click 'Add product'")
    print("   - Name: 'Premium Resources', Price: $97")
    print("   - Copy the Price ID")
    print("   - Paste into .env file")
    print()
    print("=" * 70)
    print("NEXT STEPS:")
    print("=" * 70)
    print()
    print("1. Open the .env file in a text editor")
    print("2. Replace the placeholder values with your actual keys")
    print("3. Save the file")
    print("4. Run: python check_setup.py")
    print("5. Run: python stripe_server.py")
    print()
    print("=" * 70)
    
except Exception as e:
    print(f"✗ Error creating .env file: {e}")

