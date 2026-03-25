const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Stripe webhook endpoint
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const User = require('../models/User');
      const userId = session.metadata.userId;
      const tier = session.metadata.tier;

      await User.findByIdAndUpdate(userId, {
        subscriptionTier: tier,
        stripeCustomerId: session.customer,
        subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      });
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// Create checkout session
router.post('/create-checkout-session', protect, async (req, res) => {
  try {
    const { tier } = req.body;
    const { createCheckoutSession } = require('../utils/stripeUtils');

    const session = await createCheckoutSession(req.userId, tier);

    return res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Create checkout session error:', error);
    return res.status(500).json({ message: 'Error creating checkout session' });
  }
});

module.exports = router;
