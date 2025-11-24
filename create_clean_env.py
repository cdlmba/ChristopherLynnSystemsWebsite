"""
Create Clean .env File
This will create a properly formatted .env file with your credentials.
"""

import secrets

# Your credentials
publishable_key = "pk_test_51Q5FxyE8RPwVq1YZ01tRrTHRImC7v6Sti4OG3dBOprO6PJyW74mkxwrjNyTXdl0xsNyrn5tIcgcPiYAzsbKtImyb00UgK4ctXS"
secret_key = "sk_test_51Q5FxyE8RPwVq1YZKLTqE9B4Z7VfHsOmTeYKCttnpAc8KfzSGVVLCPSOiMMW66r2J7V7305TrFZOkAHZhjn3fzY800CMAk2yMW"
price_id = "price_1SWpyOE8RPwVq1YZRVKwoyQi"

# Generate Flask secret
flask_secret = secrets.token_hex(32)

# Create clean .env content (NO COMMENTS, NO EXTRA TEXT)
env_content = f"""STRIPE_PUBLISHABLE_KEY={publishable_key}
STRIPE_SECRET_KEY={secret_key}
STRIPE_PRICE_ID={price_id}
STRIPE_WEBHOOK_SECRET=
FLASK_SECRET_KEY={flask_secret}
DOMAIN=http://localhost:5000
"""

# Write the file
with open('.env', 'w', encoding='utf-8') as f:
    f.write(env_content)

print("✅ Clean .env file created!")
print()
print("Contents:")
print("-" * 60)
print(env_content)
print("-" * 60)
