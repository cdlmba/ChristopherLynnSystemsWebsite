# Stripe Payment Integration for Christopher Lynn Systems

This is a complete Stripe payment integration that allows you to sell access to PDF resources. Users purchase access through Stripe Checkout, and upon successful payment, they receive an access token to download PDFs.

## Features

- 🔐 **Secure Payment Processing** via Stripe Checkout
- 🎫 **Token-based Authentication** for resource access
- 📄 **PDF Download Protection** - only authenticated users can download
- ⏰ **Expiring Access** - configurable access duration (default: 365 days)
- 🎨 **Beautiful, Modern UI** with glassmorphism design
- 📱 **Fully Responsive** design for all devices
- 🔔 **Webhook Support** for automated fulfillment

## Project Structure

```
├── stripe_server.py          # Main Flask application
├── templates/                 # HTML templates
│   ├── buy_button.html       # Purchase page with Stripe integration
│   ├── success.html          # Post-purchase success page
│   ├── access.html           # Protected resource library
│   ├── login.html            # Login for returning customers
│   ├── cancel.html           # Payment cancellation page
│   └── expired.html          # Access expired page
├── Resources/
│   └── protected_pdfs/       # Place your PDF files here
├── requirements.txt          # Python dependencies
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## Setup Instructions

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Stripe

1. **Create a Stripe Account** at [stripe.com](https://stripe.com)
2. **Get your API keys**:
   - Go to Stripe Dashboard → Developers → API keys
   - Copy your **Publishable key** (starts with `pk_test_`)
   - Copy your **Secret key** (starts with `sk_test_`)

3. **Create a Product and Price**:
   - Go to Stripe Dashboard → Products → Add Product
   - Set name, description, and price (e.g., $97)
   - Copy the **Price ID** (starts with `price_`)

4. **Set up Webhook** (for production):
   - Go to Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/webhook`
   - Select event: `checkout.session.completed`
   - Copy the **Webhook signing secret** (starts with `whsec_`)

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Stripe credentials:
   ```env
   STRIPE_SECRET_KEY=sk_test_your_actual_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
   STRIPE_PRICE_ID=price_your_actual_price_id
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   FLASK_SECRET_KEY=generate_a_random_secret_key
   DOMAIN=http://localhost:5000
   ```

### 4. Add Your PDF Files

Place your PDF files in the `Resources/protected_pdfs/` folder. These will be available for download after purchase.

### 5. Run the Server

```bash
python stripe_server.py
```

The server will start at `http://localhost:5000`

## Usage Flow

### For Customers:

1. **Purchase**: Visit `http://localhost:5000` and click "Proceed to Secure Checkout"
2. **Payment**: Complete payment through Stripe Checkout
3. **Success**: Receive access token and email confirmation
4. **Access**: View and download PDFs from the resource library
5. **Return**: Login anytime with email + access token

### For You (Admin):

1. Add PDF files to `Resources/protected_pdfs/`
2. Monitor purchases in Stripe Dashboard
3. Access is automatically granted upon successful payment
4. Users can access resources for 365 days (configurable)

## Customization

### Change Price

Update the price in your Stripe Dashboard and use the new Price ID in `.env`

### Change Access Duration

Edit `stripe_server.py`, line 18:
```python
ACCESS_DURATION_DAYS = 365  # Change to desired number of days
```

### Customize Design

All HTML templates are in the `templates/` folder with embedded CSS. Modify colors, fonts, and layout as needed.

### Add Database (Production)

The current implementation uses in-memory storage. For production, replace the `user_access` dictionary with a database (PostgreSQL, MongoDB, etc.)

## Testing

### Test Mode (Recommended)

Use Stripe test mode with test cards:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- Use any future expiry date and any 3-digit CVC

### Test the Flow

1. Visit `http://localhost:5000`
2. Enter an email and click checkout
3. Use test card `4242 4242 4242 4242`
4. Complete payment
5. Save the access token
6. Visit `/access` to see your PDFs
7. Test logout and login with email + token

## Production Deployment

### Important Changes for Production:

1. **Use a Database**: Replace in-memory storage with PostgreSQL/MongoDB
2. **Enable HTTPS**: Use SSL certificate (required by Stripe)
3. **Update Domain**: Change `DOMAIN` in `.env` to your actual domain
4. **Use Production Keys**: Switch from test keys to live Stripe keys
5. **Set up Webhooks**: Configure webhook endpoint for automated fulfillment
6. **Email Integration**: Add email service to send access tokens
7. **Secure Secret Key**: Use a strong, random `FLASK_SECRET_KEY`

### Recommended Hosting:

- **Heroku**: Easy deployment with PostgreSQL add-on
- **DigitalOcean**: App Platform or Droplet
- **AWS**: Elastic Beanstalk or EC2
- **Railway**: Simple Python deployment

## Security Notes

- ✅ Access tokens are cryptographically secure (32 bytes)
- ✅ PDF downloads require authentication
- ✅ Directory traversal protection on file downloads
- ✅ Stripe handles all payment security
- ⚠️ Use HTTPS in production (required)
- ⚠️ Implement rate limiting for production
- ⚠️ Use a real database for production

## Troubleshooting

### "Module not found" error
```bash
pip install -r requirements.txt
```

### Stripe keys not working
- Ensure you're using the correct test/live mode keys
- Check that keys are properly set in `.env`
- Restart the server after changing `.env`

### PDFs not showing
- Check that PDFs are in `Resources/protected_pdfs/`
- Ensure file extensions are `.pdf` (lowercase)
- Restart the server

### Payment not completing
- Check Stripe Dashboard → Logs for errors
- Verify `STRIPE_PRICE_ID` is correct
- Ensure using test card in test mode

## Support

For issues with:
- **Stripe**: [stripe.com/docs](https://stripe.com/docs)
- **Flask**: [flask.palletsprojects.com](https://flask.palletsprojects.com)

## License

This code is provided as-is for Christopher Lynn Systems. Modify as needed for your use case.
