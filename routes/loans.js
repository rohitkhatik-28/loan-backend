// routes/loans.js
const express = require('express');
const router = express.Router();

module.exports = (supabase, requireAuth) => {
  // ✅ Get all loans
  router.get('/', requireAuth, async (req, res) => {
    const { data, error } = await supabase.from('loans').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  });

  // ✅ Get single loan
  router.get('/:id', requireAuth, async (req, res) => {
    const { data, error } = await supabase.from('loans').select('*').eq('id', req.params.id).single();
    if (error) return res.status(404).json({ error: error.message });
    res.json(data);
  });

  // ✅ Create new loan
  router.post('/', requireAuth, async (req, res) => {
    const payload = req.body;
    const { data, error } = await supabase.from('loans').insert([payload]).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Loan created', data });
  });

  // ✅ Update loan
  router.put('/:id', requireAuth, async (req, res) => {
    const payload = req.body;
    const { data, error } = await supabase.from('loans').update(payload).eq('id', req.params.id).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Loan updated', data });
  });

  return router;
};
