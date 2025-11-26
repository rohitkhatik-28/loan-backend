// routes/loans.js
const express = require('express');
const supabase = require('../supabaseClient');

const router = express.Router();

// INR Format Helper
function formatINR(amount) {
  if (!amount) return null;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(Number(amount));
}

/* 
  LOANS TABLE FIELDS:

  id uuid PK
  user_id uuid FK -> users
  approved_by uuid FK -> officers
  loan_type text
  emi_amount numeric
  start_date date
  next_due_date date
  status text
  remarks text
  created_by text
*/

// ===============================
// 1) APPLY FOR LOAN
// POST /api/loans
// ===============================
router.post('/', async (req, res) => {
  try {
    const {
      user_id,
      loan_type,
      emi_amount,
      start_date,
      next_due_date,
      remarks,
      created_by,
    } = req.body;

    if (!user_id || !loan_type) {
      return res.status(400).json({ message: "user_id and loan_type are required" });
    }

    const { data, error } = await supabase
      .from("loans")
      .insert([
        {
          user_id,
          loan_type,
          emi_amount,
          start_date,
          next_due_date,
          remarks,
          created_by: created_by || "mobile_app",
          status: "applied"
        }
      ])
      .select("*")
      .single();

    if (error) return res.status(500).json({ message: error.message });

    res.status(201).json({
      ...data,
      emi_amount_in_inr: formatINR(data.emi_amount)
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// 2) GET ALL LOANS + FILTERS
// GET /api/loans?status=&loan_type=&user_id=
// ===============================
router.get('/', async (req, res) => {
  try {
    const { status, loan_type, user_id } = req.query;

    let query = supabase
      .from("loans")
      .select("*")
      .order("created_at", { ascending: false });

    if (status) query = query.eq("status", status);
    if (loan_type) query = query.eq("loan_type", loan_type);
    if (user_id) query = query.eq("user_id", user_id);

    const { data, error } = await query;

    if (error) return res.status(500).json({ message: error.message });

    const result = data.map(item => ({
      ...item,
      emi_amount_in_inr: formatINR(item.emi_amount)
    }));

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// 3) GET USER LOANS
// GET /api/loans/user/:userId
// ===============================
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("loans")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ message: error.message });

    const result = data.map(item => ({
      ...item,
      emi_amount_in_inr: formatINR(item.emi_amount)
    }));

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// 4) GET SINGLE LOAN
// GET /api/loans/:id
// ===============================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("loans")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return res.status(404).json({ message: "Loan not found" });

    res.json({
      ...data,
      emi_amount_in_inr: formatINR(data.emi_amount)
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// 5) UPDATE LOAN STATUS
// PATCH /api/loans/:id/status
// ===============================
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks, approved_by } = req.body;

    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }

    const { data, error } = await supabase
      .from("loans")
      .update({
        status,
        remarks,
        approved_by,
        updated_at: new Date()
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) return res.status(500).json({ message: error.message });

    res.json({
      ...data,
      emi_amount_in_inr: formatINR(data.emi_amount)
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
