# 🔑 YOUR STRIPE CREDENTIALS - QUICK REFERENCE

## ✅ What You Have

**Publishable Key (TEST MODE - pk_test_...):**
```
pk_test_51Q5FxyE8RPwVq1YZ01tRrTHRImC7v6Sti4OG3dBOprO6PJyW74mkxwrjNyTXdl0xsNyrn5tIcgcPiYAzsbKtImyb00UgK4ctXS
```
✓ This is your TEST publishable key (perfect for development!)
✓ Safe to use in client-side code
✓ No real charges will be made
✓ Already configured in the system

---

## ✅ GREAT CHOICE - TEST MODE

You're using **TEST MODE** which is the recommended approach for development:
- ✓ No real money involved
- ✓ Safe to experiment
- ✓ Use test cards (4242 4242 4242 4242)
- ✓ Switch to live mode when ready to launch

---

## 🔐 What You Still Need

### 1. Secret Key (TEST MODE - DO NOT SHARE)
- **Where to find**: https://dashboard.stripe.com/test/apikeys
- **Important**: Make sure you're in TEST mode (toggle in top right of dashboard)
- **Looks like**: `sk_test_...` (starts with sk_test_)
- **Action**: Click "Reveal test key token" and copy it
- **Security**: Keep this secret, but it's safe for testing (no real charges)

### 2. Price ID
- **Where to find**: https://dashboard.stripe.com/products
- **How to get**:
  1. Click "Add product" (or select existing)
  2. Name: "Premium Resources" (or your choice)
  3. Price: $97.00 USD (or your price)
  4. Click "Save product"
  5. Copy the "Price ID" (starts with `price_...`)
- **Looks like**: `price_1AbCdEfGhIjKlMnO`

### 3. Webhook Secret (Optional - for production)
- **Where to find**: https://dashboard.stripe.com/webhooks
- **How to get**:
  1. Click "Add endpoint"
  2. Endpoint URL: `https://yourdomain.com/webhook`
  3. Select event: `checkout.session.completed`
  4. Click "Add endpoint"
  5. Copy the "Signing secret" (starts with `whsec_...`)
- **Looks like**: `whsec_...`
- **Note**: Only needed for production, not for local testing

---

## 🚀 QUICK SETUP STEPS

### Option 1: Interactive Setup (Recommended)
```bash
python setup_env.py
```
This script will guide you through entering all your credentials.

### Option 2: Manual Setup
1. Copy `.env.example` to `.env`
2. Edit `.env` and add:
   - Your Secret Key (sk_live_...)
   - Your Price ID (price_...)
   - Generate Flask secret: `python -c "import secrets; print(secrets.token_hex(32))"`
3. Save the file

---

## 📋 CHECKLIST

- [x] Publishable Key obtained
- [ ] Secret Key obtained (sk_live_...)
- [ ] Product created in Stripe
- [ ] Price ID obtained (price_...)
- [ ] .env file created
- [ ] All credentials added to .env
- [ ] PDF files added to Resources/protected_pdfs/
- [ ] Pre-flight check run: `python check_setup.py`
- [ ] Server tested: `python stripe_server.py`

---

## 🔗 IMPORTANT LINKS

- **Stripe Dashboard**: https://dashboard.stripe.com
- **API Keys**: https://dashboard.stripe.com/apikeys
- **Products**: https://dashboard.stripe.com/products
- **Payments**: https://dashboard.stripe.com/payments
- **Webhooks**: https://dashboard.stripe.com/webhooks
- **Test Cards**: https://stripe.com/docs/testing

---

## 🧪 TEST CARDS

Once set up, use these test cards:

**Success:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

**Decline:**
- Card: `4000 0000 0000 0002`

**Requires Authentication:**
- Card: `4000 0025 0000 3155`

---

## ⚡ NEXT COMMANDS TO RUN

```bash
# 1. Set up your environment (interactive)
python setup_env.py

# 2. Verify everything is configured
python check_setup.py

# 3. Start the server
python stripe_server.py

# 4. Visit in browser
# http://localhost:5000
```

---

## 🆘 TROUBLESHOOTING

**"Invalid API key"**
- Check that Secret Key starts with `sk_live_`
- Ensure no extra spaces in `.env` file
- Restart server after changing `.env`

**"No such price"**
- Verify Price ID in Stripe Dashboard
- Ensure you're using the Price ID, not Product ID
- Check that price is active

**"Publishable key is invalid"**
- Verify key starts with `pk_live_`
- Check for typos
- Ensure key is from same Stripe account

---

## 🔒 SECURITY BEST PRACTICES

✅ **DO:**
- Keep `.env` file local only (never commit to git)
- Use HTTPS in production
- Rotate keys if compromised
- Monitor Stripe Dashboard regularly
- Use test mode for development

❌ **DON'T:**
- Share your Secret Key (sk_live_...)
- Commit `.env` to git
- Use live keys in test environment
- Hardcode keys in source code
- Share keys in chat/email/screenshots

---

## 📞 NEED HELP?

- **Stripe Support**: https://support.stripe.com
- **Documentation**: See `STRIPE_README.md`
- **Quick Start**: See `QUICK_START.md`
- **Flow Diagrams**: See `FLOW_DIAGRAM.md`

---

**Ready to continue?** Run: `python setup_env.py`
