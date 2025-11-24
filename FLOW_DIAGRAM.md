# Stripe Payment Flow Diagram

## User Journey Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    CUSTOMER PURCHASE FLOW                        │
└─────────────────────────────────────────────────────────────────┘

1. DISCOVERY
   ┌──────────────────────┐
   │ Your Website         │
   │ (index.html,         │
   │  premium-resources)  │
   └──────────┬───────────┘
              │ Click "Get Access"
              ▼
2. CHECKOUT
   ┌──────────────────────┐
   │ Buy Button Page      │
   │ (localhost:5000)     │
   │ - Enter email        │
   │ - Click checkout     │
   └──────────┬───────────┘
              │ Create Stripe Session
              ▼
3. PAYMENT
   ┌──────────────────────┐
   │ Stripe Checkout      │
   │ (stripe.com)         │
   │ - Enter card info    │
   │ - Complete payment   │
   └──────────┬───────────┘
              │ Payment Success
              ▼
4. SUCCESS
   ┌──────────────────────┐
   │ Success Page         │
   │ - Show access token  │
   │ - Email confirmation │
   │ - Access button      │
   └──────────┬───────────┘
              │ Click "Access Resources"
              ▼
5. ACCESS
   ┌──────────────────────┐
   │ Resource Library     │
   │ - View all PDFs      │
   │ - Download files     │
   │ - Logout option      │
   └──────────────────────┘

6. RETURN VISIT
   ┌──────────────────────┐
   │ Login Page           │
   │ - Enter email        │
   │ - Enter token        │
   │ - Access resources   │
   └──────────────────────┘
```

## Technical Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND PROCESS FLOW                          │
└─────────────────────────────────────────────────────────────────┘

CLIENT                    FLASK SERVER              STRIPE
  │                            │                       │
  │ 1. Visit /                 │                       │
  ├───────────────────────────>│                       │
  │ 2. Return buy_button.html  │                       │
  │<───────────────────────────┤                       │
  │                            │                       │
  │ 3. Submit email            │                       │
  ├───────────────────────────>│                       │
  │                            │ 4. Create session     │
  │                            ├──────────────────────>│
  │                            │ 5. Return session ID  │
  │                            │<──────────────────────┤
  │ 6. Return session ID       │                       │
  │<───────────────────────────┤                       │
  │                            │                       │
  │ 7. Redirect to Stripe      │                       │
  ├────────────────────────────────────────────────────>│
  │                            │                       │
  │ 8. Customer pays           │                       │
  │                            │                       │
  │ 9. Redirect to /success    │                       │
  │<────────────────────────────────────────────────────┤
  │                            │                       │
  │ 10. Request /success       │                       │
  ├───────────────────────────>│                       │
  │                            │ 11. Verify payment    │
  │                            ├──────────────────────>│
  │                            │ 12. Confirm paid      │
  │                            │<──────────────────────┤
  │                            │                       │
  │                            │ 13. Generate token    │
  │                            │ 14. Store access      │
  │                            │ 15. Create session    │
  │                            │                       │
  │ 16. Return success page    │                       │
  │<───────────────────────────┤                       │
  │                            │                       │
  │ 17. Request /access        │                       │
  ├───────────────────────────>│                       │
  │                            │ 18. Verify token      │
  │                            │ 19. List PDFs         │
  │ 20. Return access page     │                       │
  │<───────────────────────────┤                       │
  │                            │                       │
  │ 21. Download PDF           │                       │
  ├───────────────────────────>│                       │
  │                            │ 22. Verify auth       │
  │                            │ 23. Send PDF file     │
  │ 24. Receive PDF            │                       │
  │<───────────────────────────┤                       │
```

## File Structure

```
christopher-lynn-systems/
│
├── stripe_server.py              # Main Flask application
│   ├── Routes:
│   │   ├── /                     → Buy button page
│   │   ├── /create-checkout      → Create Stripe session
│   │   ├── /success              → Post-payment success
│   │   ├── /cancel               → Payment cancelled
│   │   ├── /access               → Protected resource library
│   │   ├── /login                → Returning customer login
│   │   ├── /download/<file>      → Download PDF
│   │   ├── /webhook              → Stripe webhook
│   │   └── /logout               → Clear session
│
├── templates/                     # HTML templates
│   ├── buy_button.html           # Purchase page
│   ├── success.html              # Success + token display
│   ├── access.html               # Resource library
│   ├── login.html                # Login form
│   ├── cancel.html               # Cancellation page
│   └── expired.html              # Access expired
│
├── Resources/
│   └── protected_pdfs/           # Your PDF files
│       ├── Framework_Guide.pdf
│       ├── Energy_Workbook.pdf
│       └── ... (your PDFs)
│
├── .env                          # Environment variables (SECRET)
├── .env.example                  # Template for .env
├── requirements.txt              # Python dependencies
├── STRIPE_README.md              # Full documentation
├── QUICK_START.md                # Quick setup guide
└── premium-resources.html        # Marketing page
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA STORAGE & SECURITY                       │
└─────────────────────────────────────────────────────────────────┘

USER DATA STORED:
{
  "user@email.com": {
    "access_token": "random_32_byte_token",
    "expires": "2025-11-23",
    "session_id": "cs_test_..."
  }
}

SECURITY MEASURES:
✓ Access tokens are cryptographically secure (32 bytes)
✓ Tokens stored server-side only
✓ Session-based authentication
✓ PDF downloads require valid token
✓ Directory traversal protection
✓ Stripe handles all payment data (PCI compliant)

IMPORTANT FOR PRODUCTION:
⚠ Replace in-memory storage with database
⚠ Add email notifications
⚠ Implement rate limiting
⚠ Use HTTPS (required by Stripe)
⚠ Set up proper webhook handling
```

## Stripe Dashboard Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    STRIPE DASHBOARD SECTIONS                     │
└─────────────────────────────────────────────────────────────────┘

1. PAYMENTS
   - View all transactions
   - See customer details
   - Refund if needed
   - Export data

2. PRODUCTS
   - Your "Premium Resources" product
   - Price: $97 (or your price)
   - Get Price ID here

3. DEVELOPERS → API KEYS
   - Publishable key (pk_test_...)
   - Secret key (sk_test_...)
   - Toggle Test/Live mode

4. DEVELOPERS → WEBHOOKS
   - Add endpoint URL
   - Select events to listen for
   - Get webhook secret
   - View webhook logs

5. LOGS
   - Debug API calls
   - See errors
   - Monitor activity
```

## Environment Variables Explained

```
┌─────────────────────────────────────────────────────────────────┐
│                    .ENV FILE BREAKDOWN                           │
└─────────────────────────────────────────────────────────────────┘

STRIPE_SECRET_KEY=sk_test_...
  ↳ Server-side key for API calls
  ↳ NEVER expose to client
  ↳ Get from: Stripe Dashboard → Developers → API keys

STRIPE_PUBLISHABLE_KEY=pk_test_...
  ↳ Client-side key for Stripe.js
  ↳ Safe to expose in HTML
  ↳ Get from: Stripe Dashboard → Developers → API keys

STRIPE_PRICE_ID=price_...
  ↳ ID of your product price
  ↳ Get from: Stripe Dashboard → Products → Your Product

STRIPE_WEBHOOK_SECRET=whsec_...
  ↳ Verifies webhook authenticity
  ↳ Get from: Stripe Dashboard → Developers → Webhooks
  ↳ Only needed for production

FLASK_SECRET_KEY=random_string
  ↳ Secures Flask sessions
  ↳ Use any random string
  ↳ Generate: python -c "import secrets; print(secrets.token_hex(32))"

DOMAIN=http://localhost:5000
  ↳ Your server URL
  ↳ Local: http://localhost:5000
  ↳ Production: https://yourdomain.com
```

## Testing Checklist

```
┌─────────────────────────────────────────────────────────────────┐
│                    TESTING WORKFLOW                              │
└─────────────────────────────────────────────────────────────────┘

□ Install dependencies
□ Configure .env file
□ Add sample PDF to protected_pdfs/
□ Start server (python stripe_server.py)
□ Visit http://localhost:5000
□ Enter test email
□ Click checkout
□ Use test card: 4242 4242 4242 4242
□ Complete payment
□ Save access token
□ Verify success page shows
□ Click "Access Resources"
□ Verify PDFs are listed
□ Download a PDF
□ Logout
□ Login with email + token
□ Verify access still works
□ Test expired access (change ACCESS_DURATION_DAYS to 0)
□ Test invalid token
□ Test payment cancellation
```

---

For detailed setup instructions, see QUICK_START.md
For complete documentation, see STRIPE_README.md
