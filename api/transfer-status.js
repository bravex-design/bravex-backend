const axios = require('axios');
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const r = await axios.get(`https://api.harborfi.com/v1/transfer/${req.query.id}`, {
      headers: { 'Authorization': `Bearer ${process.env.HARBOR_API_KEY}` }
    });
    res.json(r.data);
  } catch (e) { res.status(e.response?.status||500).json(e.response?.data||{error:e.message}); }
};
