// routes/loan_logs.js
const express = require('express');
const router = express.Router();

module.exports = (supabase, requireAuth) => {
  router.get('/', requireAuth, async (req, res) => {
    const { loan_id } = req.query;
    let q = supabase.from('loan_status_logs').select('*');
    if (loan_id) q = q.eq('loan_id', loan_id);
    const { data, error } = await q;
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  });

  router.post('/', requireAuth, async (req, res) => {
    const { data, error } = await supabase.from('loan_status_logs').insert([req.body]).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Log added', data });
  });

  return router;
};
