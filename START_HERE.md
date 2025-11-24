# 🚀 START HERE - Your Stripe Integration Setup

## ✅ You're Using TEST MODE (Perfect!)

Your test publishable key is already configured:
```
pk_test_51Q5FxyE8RPwVq1YZ01tRrTHRImC7v6Sti4OG3dBOprO6PJyW74mkxwrjNyTXdl0xsNyrn5tIcgcPiYAzsbKtImyb00UgK4ctXS
```

This means:
- ✓ No real money will be charged
- ✓ Safe to test and experiment
- ✓ Use test card: 4242 4242 4242 4242
- ✓ Switch to live mode when ready to launch

---

## 📋 3-Step Quick Setup

### Step 1: Get Your Stripe Test Secret Key (2 minutes)

1. Go to: **https://dashboard.stripe.com/test/apikeys**
2. Make sure the toggle says **"Test mode"** (top right)
3. Find **"Secret key"**
4. Click **"Reveal test key token"**
5. Copy the key (starts with `sk_test_...`)

**Keep this handy - you'll need it in Step 2!**

---

### Step 2: Create a Test Product (2 minutes)

1. Go to: **https://dashboard.stripe.com/test/products**
2. Click **"Add product"**
3. Fill in:
   - **Name**: Premium Resources (or your choice)
   - **Description**: Access to exclusive PDFs and frameworks
   - **Price**: $97.00 USD (or your price)
4. Click **"Save product"**
5. Copy the **"Price ID"** (starts with `price_...`)

**Keep this handy - you'll need it in Step 2!**

---

### Step 3: Run the Setup Script (1 minute)

Open your terminal and run:

```bash
python setup_env.py
```

The script will ask you for:
1. Your **Secret Key** (from Step 1)
2. Your **Price ID** (from Step 2)

That's it! The script will create your `.env` file automatically.

---

## 🧪 Test Your Setup

After completing the 3 steps above:

```bash
# 1. Verify everything is configured
python check_setup.py

# 2. Start the server
python stripe_server.py

# 3. Open your browser to:
http://localhost:5000
```

### Use This Test Card:
- **Card Number**: 4242 4242 4242 4242
- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

---

## 📁 Before You Test - Add PDFs

Place your PDF files in this folder:
```
Resources/protected_pdfs/
```

Example files:
- Framework_Guide.pdf
- Energy_Optimization.pdf
- Weekly_Planning_Template.pdf

These will automatically appear in your resource library after purchase!

---

## 🎯 What Happens When You Test

1. **Visit** http://localhost:5000
2. **Enter** any test email (e.g., test@example.com)
3. **Click** "Proceed to Secure Checkout"
4. **Use** test card: 4242 4242 4242 4242
5. **Complete** the payment
6. **Save** your access token (shown on success page)
7. **Download** your PDFs from the resource library
8. **Test** logout and login with email + token

---

## 📚 Need More Help?

- **Quick Setup**: See `QUICK_START.md`
- **Full Documentation**: See `STRIPE_README.md`
- **Your Credentials**: See `CREDENTIALS_GUIDE.md`
- **Flow Diagrams**: See `FLOW_DIAGRAM.md`

---

## ⚡ Quick Commands Reference

```bash
# Install dependencies (first time only)
pip install -r requirements.txt

# Set up environment variables (interactive)
python setup_env.py

# Check if everything is configured
python check_setup.py

# Start the server
python stripe_server.py

# Visit in browser
http://localhost:5000
```

---

## 🔄 When You're Ready to Go Live

Once you've tested everything and you're ready for real customers:

1. Switch Stripe to **Live mode**
2. Get your **Live API keys** (pk_live_... and sk_live_...)
3. Update your `.env` file with live keys
4. Deploy to a server with **HTTPS** (required)
5. Update `DOMAIN` in `.env` to your actual domain
6. Test with a real card (small amount)
7. Launch! 🎉

---

## 🆘 Common Issues

**"No module named 'flask'"**
```bash
pip install -r requirements.txt
```

**"Invalid API key"**
- Make sure you're using TEST keys (sk_test_...)
- Check for typos in `.env` file
- Restart the server after changing `.env`

**"No PDFs showing"**
- Add PDF files to `Resources/protected_pdfs/`
- Make sure files end with `.pdf`
- Restart the server

---

## ✅ Your Checklist

- [ ] Got test secret key from Stripe
- [ ] Created test product in Stripe
- [ ] Got price ID from Stripe
- [ ] Ran `python setup_env.py`
- [ ] Added PDF files to `Resources/protected_pdfs/`
- [ ] Ran `python check_setup.py`
- [ ] Started server with `python stripe_server.py`
- [ ] Tested purchase with test card
- [ ] Verified PDFs download correctly
- [ ] Tested login with access token

---

**Ready?** Run: `python setup_env.py`

Then follow the prompts to complete your setup! 🚀
