// routes/users.js
const express = require('express');
const supabase = require('../supabaseClient');

const router = express.Router();

// ================================
// 1) Get all users
// GET /api/users
// ================================
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ message: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================================
// 2) Get user by ID
// GET /api/users/:id
// ================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return res.status(404).json({ message: 'User not found' });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================================
// 3) Create User
// POST /api/users
// ================================
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      aadhaar_num,
      address,
      city,
      state,
      pincode,
      dob,
      created_by,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'name and email are required' });
    }

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          mobile,
          aadhaar_num,
          address,
          city,
          state,
          pincode,
          dob,
          created_by: created_by || 'system',
        },
      ])
      .select('*')
      .single();

    if (error) return res.status(500).json({ message: error.message });

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================================
// 4) Update User
// PUT /api/users/:id
// ================================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const updateFields = { ...req.body, updated_at: new Date() };

    const { data, error } = await supabase
      .from('users')
      .update(update
