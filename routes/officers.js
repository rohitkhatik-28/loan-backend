// routes/officers.js
const express = require('express');
const router = express.Router();

module.exports = (supabase, requireAuth) => {
  router.get('/', requireAuth, async (req, res) => {
    const { data, error } = await supabase.from('officers').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  });

  router.post('/', requireAuth, async (req, res) => {
    const { data, error } = await supabase.from('officers').insert([req.body]).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Officer created', data });
  });

  return router;
};
