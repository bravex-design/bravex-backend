const axios = require('axios');

const HARBOR_BASE = process.env.HARBOR_ENV === 'production'
  ? 'https://harbor.owlpay.com/api/v2'
  : 'https://harbor-sandbox.owlpay.com/api/v2';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { amount, sourceCountry, sourceAsset, destChain, commission } = req.body;
    const payload = {
      source: { country: sourceCountry || 'US', asset: sourceAsset || 'USD', amount: parseFloat(amount), type: 'individual' },
      destination: { chain: destChain || 'ethereum', asset: 'USDC', type: 'individual' },
      commission: { amount: commission || 0, percentage: 0 }
    };
    const { data } = await axios.post(`${HARBOR_BASE}/transfers/quotes`, payload, {
      headers: { 'X-API-KEY': process.env.HARBOR_API_KEY, 'Content-Type': 'application/json' }
    });
    res.json({ success: true, data: data.data });
  } catch (err) {
    res.status(err.response?.status || 500).json({ success: false, error: err.response?.data || err.message });
  }
};