const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

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
    const { quoteId, customerUUID, walletAddress, walletChain, transferPurpose, isSelfTransfer } = req.body;
    const payload = {
      on_behalf_of: customerUUID,
      quote_id: quoteId,
      application_transfer_uuid: `BRAVEX-${uuidv4()}`,
      destination: {
        asset: 'USDC', chain: walletChain || 'ethereum', address: walletAddress,
        transfer_purpose: transferPurpose || 'TRANSFER_TO_OWN_ACCOUNT',
        is_self_transfer: isSelfTransfer || false
      }
    };
    const { data } = await axios.post(`${HARBOR_BASE}/transfers`, payload, {
      headers: { 'X-API-KEY': process.env.HARBOR_API_KEY, 'Content-Type': 'application/json' }
    });
    res.json({ success: true, data: data.data });
  } catch (err) {
    res.status(err.response?.status || 500).json({ success: false, error: err.response?.data || err.message });
  }
};