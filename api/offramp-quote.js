const axios = require('axios');
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { amount, source_currency = 'usdc', destination_currency = 'usd' } = req.body;
    // Bridge charges ~0.3% fee — return a simulated quote
    const fee = (parseFloat(amount) * 0.003).toFixed(2);
    const receive = (parseFloat(amount) - parseFloat(fee)).toFixed(2);
    res.json({
      source_currency,
      destination_currency,
      amount,
      fee,
      destination_amount: receive,
      exchange_rate: '1.00',
      expires_at: new Date(Date.now() + 30000).toISOString()
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
};