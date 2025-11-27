// routes/officers.js
const express = require('express');
const supabase = require('../supabaseClient');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

// ===============================
// 1) REGISTER OFFICER (admin use only)
// POST /api/officers/register
// ===============================
router.post('/register', async (req, res) => {
  try {
    const { name, email, mobile, designation, branch_name, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, password required" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("officers")
      .insert([
        {
          name,
          email,
          mobile,
          designation,
          branch_name,
          password: hashedPass
        },
      ])
      .select("*")
      .single();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    res.status(201).json({ message: "Officer registered", officer: data });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ===============================
// 2) LOGIN OFFICER
// POST /api/officers/login
// ===============================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase
      .from("officers")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValid = await bcrypt.compare(password, data.password);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: data.id,
        name: data.name,
        designation: data.designation,
        branch_name: data.branch_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      officer: {
        id: data.id,
        name: data.name,
        email: data.email,
        designation: data.designation,
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
