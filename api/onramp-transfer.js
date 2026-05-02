const axios = require('axios');
const crypto = require('crypto');
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { amount, to_address, external_account_id, on_behalf_of, chain = 'ethereum' } = req.body;
    const r = await axios.post('https://api.bridge.xyz/v0/transfers', {
      amount: String(amount),
      on_behalf_of,
      source: {
        currency: 'usd',
        payment_rail: 'ach',
        external_account_id
      },
      destination: {
        currency: 'usdc',
        payment_rail: chain,
        to_address
      }
    }, {
      headers: {
        'Api-Key': process.env.BRIDGE_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Idempotency-Key': crypto.randomUUID()
      }
    });
    res.json(r.data);
  } catch (e) { res.status(e.response?.status||500).json(e.response?.data||{error:e.message}); }
};