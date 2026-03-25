const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (userId, tier) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(userId);

    const priceMap = {
      pro: process.env.STRIPE_PRO_PRICE_ID,
      enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    };

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceMap[tier],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
      metadata: {
        userId: userId.toString(),
        tier: tier,
      },
    });

    return session;
  } catch (error) {
    console.error('Stripe session creation error:', error);
    throw new Error('Failed to create checkout session');
  }
};

module.exports = { createCheckoutSession };
