const axios = require('axios');

const HARBOR_BASE = process.env.HARBOR_ENV === 'production'
  ? 'https://harbor.owlpay.com/api/v2'
  : 'https://harbor-sandbox.owlpay.com/api/v2';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { transferId } = req.query;
    const { data } = await axios.get(`${HARBOR_BASE}/transfers/${transferId}`, {
      headers: { 'X-API-KEY': process.env.HARBOR_API_KEY, 'Content-Type': 'application/json' }
    });
    res.json({ success: true, data: data.data });
  } catch (err) {
    res.status(err.response?.status || 500).json({ success: false, error: err.response?.data || err.message });
  }
};