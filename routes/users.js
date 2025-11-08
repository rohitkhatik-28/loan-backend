// routes/users.js
const express = require('express');
const router = express.Router();

module.exports = (supabase, requireAuth) => {
  // ✅ GET - all users
  router.get('/', requireAuth, async (req, res) => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  });

  // ✅ GET - single user
  router.get('/:id', requireAuth, async (req, res) => {
    const { data, error } = await supabase.from('users').select('*').eq('id', req.params.id).single();
    if (error) return res.status(404).json({ error: error.message });
    res.json(data);
  });

  // ✅ POST - create new user
  router.post('/', requireAuth, async (req, res) => {
    const payload = req.body;
    const { data, error } = await supabase.from('users').insert([payload]).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'User created successfully', data });
  });

  // ✅ PUT - update user
  router.put('/:id', requireAuth, async (req, res) => {
    const payload = req.body;
    const { data, error } = await supabase.from('users').update(payload).eq('id', req.params.id).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'User updated', data });
  });

  return router;
};
