// routes/ai_analysis.js
const express = require('express');
const router = express.Router();

module.exports = (supabase, requireAuth) => {
  router.get('/', requireAuth, async (req, res) => {
    const { data, error } = await supabase.from('ai_analysis').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  });

  router.post('/', requireAuth, async (req, res) => {
    const { data, error } = await supabase.from('ai_analysis').insert([req.body]).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'AI record added', data });
  });

  return router;
};
