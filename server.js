const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.TEST_API || !process.env.TEST_SECRET) {
  console.warn('Missing TEST_API or TEST_SECRET in .env');
}

const razorpay = new Razorpay({
  key_id: process.env.TEST_API,
  key_secret: process.env.TEST_SECRET,
});

// Create order
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount = 49900, currency = 'INR', email } = req.body || {};

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: `rcpt_${Date.now()}`,
    });

    res.json({
      keyId: process.env.TEST_API,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      email,
    });
  } catch (err) {
    console.error('create-order error:', err?.response?.data || err.message || err);
    res.status(500).json({ error: 'order_failed' });
  }
});

// Verify payment signature
app.post('/api/verify-payment', (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body || {};
    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ error: 'missing_fields' });
    }

    const hmac = crypto.createHmac('sha256', process.env.TEST_SECRET);
    hmac.update(`${orderId}|${paymentId}`);
    const digest = hmac.digest('hex');

    if (digest !== signature) {
      return res.status(400).json({ error: 'invalid_signature' });
    }

    return res.json({ status: 'ok' });
  } catch (err) {
    console.error('verify-payment error:', err);
    return res.status(500).json({ error: 'verify_failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
