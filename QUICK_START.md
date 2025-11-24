# Quick Start Guide - Stripe Payment Integration

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Set Up Stripe (Test Mode)

1. **Sign up at Stripe**: https://dashboard.stripe.com/register
2. **Get Test Keys**:
   - Click "Developers" → "API keys"
   - Copy "Publishable key" (pk_test_...)
   - Copy "Secret key" (sk_test_...)

3. **Create a Product**:
   - Click "Products" → "Add product"
   - Name: "Premium Resources"
   - Price: $97 (or your price)
   - Click "Save product"
   - Copy the "Price ID" (price_...)

### Step 3: Configure Environment

1. Create `.env` file:
```bash
copy .env.example .env
```

2. Edit `.env` with your keys:
```env
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_PRICE_ID=price_YOUR_PRICE_ID_HERE
FLASK_SECRET_KEY=any_random_string_here
DOMAIN=http://localhost:5000
```

### Step 4: Add Your PDFs

Place your PDF files in:
```
Resources/protected_pdfs/
```

Example:
- `Resources/protected_pdfs/Framework_Guide.pdf`
- `Resources/protected_pdfs/Energy_Optimization.pdf`

### Step 5: Run the Server

```bash
python stripe_server.py
```

Visit: http://localhost:5000

## 🧪 Testing

### Test the Purchase Flow:

1. Go to http://localhost:5000
2. Enter any email (e.g., test@example.com)
3. Click "Proceed to Secure Checkout"
4. Use Stripe test card:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)
5. Complete payment
6. **SAVE YOUR ACCESS TOKEN** (shown on success page)
7. Click "Access Your Resources"
8. Download PDFs

### Test Login:

1. Go to http://localhost:5000/login
2. Enter your email and access token
3. Access your resources

## 📋 Checklist

- [ ] Python installed
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] Stripe account created
- [ ] Test API keys obtained
- [ ] Product and Price created in Stripe
- [ ] `.env` file configured
- [ ] PDF files added to `Resources/protected_pdfs/`
- [ ] Server running (`python stripe_server.py`)
- [ ] Test purchase completed successfully
- [ ] PDFs downloadable

## 🔧 Common Issues

### "No module named 'flask'"
```bash
pip install -r requirements.txt
```

### "Invalid API key"
- Check `.env` file has correct Stripe keys
- Ensure no extra spaces in `.env`
- Restart server after changing `.env`

### "No PDFs showing"
- Add PDF files to `Resources/protected_pdfs/`
- Ensure files end with `.pdf`
- Restart server

### Port already in use
Edit `stripe_server.py` last line:
```python
app.run(debug=True, port=5001)  # Change port
```

## 🌐 Integration with Your Website

### Option 1: Link to Payment Page
Add a button to your existing website:
```html
<a href="http://localhost:5000" class="btn">Get Premium Access</a>
```

### Option 2: Use the Premium Resources Page
Copy `premium-resources.html` and integrate it into your site navigation.

### Option 3: Embed Buy Button
Add this to any page:
```html
<a href="http://localhost:5000" 
   style="display: inline-block; padding: 16px 32px; 
          background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%); 
          color: white; text-decoration: none; border-radius: 12px; 
          font-weight: 600;">
    Get Instant Access - $97
</a>
```

## 📧 Next Steps

1. **Test thoroughly** with Stripe test cards
2. **Add your actual PDFs** to the protected folder
3. **Customize the design** in the HTML templates
4. **Set up email notifications** (optional)
5. **Deploy to production** when ready

## 🚀 Going Live

When ready for production:

1. Switch to Stripe Live mode
2. Get Live API keys
3. Update `.env` with live keys
4. Change `DOMAIN` to your actual domain
5. Enable HTTPS (required)
6. Set up webhook endpoint
7. Test with real card (small amount)
8. Launch! 🎉

## 📚 Resources

- **Full Documentation**: See `STRIPE_README.md`
- **Stripe Docs**: https://stripe.com/docs
- **Test Cards**: https://stripe.com/docs/testing

## 💡 Tips

- Keep your access token safe - it's like a password
- Test the entire flow before going live
- Use Stripe Dashboard to monitor payments
- Check webhook logs for debugging
- Start with test mode, switch to live when ready

---

Need help? Check `STRIPE_README.md` for detailed documentation.
