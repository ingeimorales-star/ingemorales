import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { nombre, correo } = req.body || {};

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        { price: 'price_1TsFHpImuwQn2usBfBCWpE3p', quantity: 1 }
      ],
      mode: 'payment',
      customer_email: correo || undefined,
      metadata: {
        nombre: nombre || '',
      },
      return_url: `https://ingeimorales.com/gracias?session_id={CHECKOUT_SESSION_ID}`,
    });

    res.status(200).json({ clientSecret: session.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
