import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        { price: 'price_1TsForImuwQn2usBXTsgT1h2', quantity: 1 }
      ],
      mode: 'payment',
      custom_fields: [
        {
          key: 'nombre_completo',
          label: { type: 'custom', custom: 'Nombre completo (para tu constancia)' },
          type: 'text',
        },
        {
          key: 'whatsapp',
          label: { type: 'custom', custom: 'WhatsApp' },
          type: 'text',
        },
      ],
      return_url: `https://ingeimorales.com/gracias?session_id={CHECKOUT_SESSION_ID}`,
    });

    res.status(200).json({ clientSecret: session.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
