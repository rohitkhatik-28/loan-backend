// routes/agriculture_loan.js
const express = require('express');
const supabase = require('../supabaseClient');

const router = express.Router();

// INR Format Helper
function formatINR(amount) {
  if (!amount) return null;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(amount));
}

/*
agriculture_loan table fields:
loan_id, crop_type, duration,
interest_rate, loan_amount, farm_area
*/

// ===============================
// 1) CREATE Agriculture Loan Detail
// POST /api/agriculture-loan
// ===============================
router.post('/', async (req, res) => {
  try {
    const {
      loan_id,
      crop_type,
      duration,
      interest_rate,
      loan_amount,
      farm_area,
    } = req.body;

    if (!loan_id) {
      return res.status(400).json({ message: "loan_id is required" });
    }

    const { data, error } = await supabase
      .from("agriculture_loan")
      .insert([
        {
          loan_id,
          crop_type,
          duration,
          interest_rate,
          loan_amount,
          farm_area,
        },
      ])
      .select("*")
      .single();

    if (error) return res.status(500).json({ message: error.message });

    res.status(201).json({
      ...data,
      loan_amount_in_inr: formatINR(data.loan_amount),
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// 2) GET All Agriculture Loans
// GET /api/agriculture-loan
// ===============================
router.get('/', async (req, res) => {
  try {
    const { loan_id } = req.query;

    let query = supabase.from("agriculture_loan").select("*");
    if (loan_id) query = query.eq("loan_id", loan_id);

    const { data, error } = await query;

    if (error) return res.status(500).json({ message: error.message });

    const result = data.map((item) => ({
      ...item,
      loan_amount_in_inr: formatINR(item.loan_amount),
    }));

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// 3) GET Agriculture Loan by loan_id
// GET /api/agriculture-loan/:loanId
// ===============================
router.get('/:loanId', async (req, res) => {
  try {
    const { loanId } = req.params;

    const { data, error } = await supabase
      .from("agriculture_loan")
      .select("*")
      .eq("loan_id", loanId)
      .single();

    if (error) return res.status(404).json({ message: "Agriculture loan detail not found" });

    res.json({
      ...data,
      loan_amount_in_inr: formatINR(data.loan_amount),
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// 4) UPDATE Agriculture Loan Detail
// PUT /api/agriculture-loan/:loanId
// ===============================
router.put('/:loanId', async (req, res) => {
  try {
    const { loanId } = req.params;

    const updateFields = { ...req.body, updated_at: new Date() };

    const { data, error } = await supabase
      .from("agriculture_loan")
      .update(updateFields)
      .eq("loan_id", loanId)
      .select("*")
      .single();

    if (error) return res.status(500).json({ message: error.message });

    res.json({
      ...data,
      loan_amount_in_inr: formatINR(data.loan_amount),
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
