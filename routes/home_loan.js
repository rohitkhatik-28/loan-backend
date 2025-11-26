// routes/home_loan.js
const express = require('express');
const supabase = require('../supabaseClient');

const router = express.Router();

// INR format helper
function formatINR(amount) {
  if (!amount) return null;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(amount));
}

/*
home_loan table fields:
loan_id, property_address, property_value,
builder_name, interest_rate, duration, loan_amount
*/

// ===============================
// 1) Create Home Loan Detail
// POST /api/home-loan
// ===============================
router.post('/', async (req, res) => {
  try {
    const {
      loan_id,
      property_address,
      property_value,
      builder_name,
      interest_rate,
      duration,
      loan_amount,
    } = req.body;

    if (!loan_id) {
      return res.status(400).json({ message: "loan_id is required" });
    }

    const { data, error } = await supabase
      .from("home_loan")
      .insert([
        {
          loan_id,
          property_address,
          property_value,
          builder_name,
          interest_rate,
          duration,
          loan_amount,
        },
      ])
      .select("*")
      .single();

    if (error) return res.status(500).json({ message: error.message });

    res.status(201).json({
      ...data,
      property_value_in_inr: formatINR(data.property_value),
      loan_amount_in_inr: formatINR(data.loan_amount),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// 2) Get all Home Loan records
// GET /api/home-loan
// ===============================
router.get('/', async (req, res) => {
  try {
    const { loan_id } = req.query;

    let query = supabase.from("home_loan").select("*");

    if (loan_id) query = query.eq("loan_id", loan_id);

    const { data, error } = await query;

    if (error) return res.status(500).json({ message: error.message });

    const result = data.map((item) => ({
      ...item,
      property_value_in_inr: formatINR(item.property_value),
      loan_amount_in_inr: formatINR(item.loan_amount),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// 3) Get single Home Loan Detail
// GET /api/home-loan/:loanId
// ===============================
router.get('/:loanId', async (req, res) => {
  try {
    const { loanId } = req.params;

    const { data, error } = await supabase
      .from("home_loan")
      .select("*")
      .eq("loan_id", loanId)
      .single();

    if (error) {
      return res.status(404).json({ message: "Home loan detail not found" });
    }

    res.json({
      ...data,
      property_value_in_inr: formatINR(data.property_value),
      loan_amount_in_inr: formatINR(data.loan_amount),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// 4) Update Home Loan Detail
// PUT /api/home-loan/:loanId
// ===============================
router.put('/:loanId', async (req, res) => {
  try {
    const { loanId } = req.params;

    const updateFields = { ...req.body, updated_at: new Date() };

    const { data, error } = await supabase
      .from("home_loan")
      .update(updateFields)
      .eq("loan_id", loanId)
      .select("*")
      .single();

    if (error) return res.status(500).json({ message: error.message });

    res.json({
      ...data,
      property_value_in_inr: formatINR(data.property_value),
      loan_amount_in_inr: formatINR(data.loan_amount),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
