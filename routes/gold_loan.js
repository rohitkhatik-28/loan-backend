// routes/gold_loan.js
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
gold_loan table fields:
loan_id, gold_weight, gold_purity,
duration, interest_rate, loan_amount
*/

// ===============================
// 1) CREATE Gold Loan Detail
// POST /api/gold-loan
// ===============================
router.post('/', async (req, res) => {
  try {
    const {
      loan_id,
      gold_weight,
      gold_purity,
      duration,
      interest_rate,
      loan_amount,
    } = req.body;

    if (!loan_id) {
      return res.status(400).json({ message: "loan_id is required" });
    }

    const { data, error } = await supabase
      .from("gold_loan")
      .insert([
        {
          loan_id,
          gold_weight,
          gold_purity,
          duration,
          interest_rate,
          loan_amount
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
// 2) GET All Gold Loans
// GET /api/gold-loan
// ===============================
router.get('/', async (req, res) => {
  try {
    const { loan_id } = req.query;

    let query = supabase.from("gold_loan").select("*");
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
// 3) GET Gold Loan by loan_id
// GET /api/gold-loan/:loanId
// ===============================
router.get('/:loanId', async (req, res) => {
  try {
    const { loanId } = req.params;

    const { data, error } = await supabase
      .from("gold_loan")
      .select("*")
      .eq("loan_id", loanId)
      .single();

    if (error) return res.status(404).json({ message: "Gold loan detail not found" });

    res.json({
      ...data,
      loan_amount_in_inr: formatINR(data.loan_amount),
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// 4) UPDATE Gold Loan Detail
// PUT /api/gold-loan/:loanId
// ===============================
router.put('/:loanId', async (req, res) => {
  try {
    const { loanId } = req.params;

    const updateFields = { ...req.body, updated_at: new Date() };

    const { data, error } = await supabase
      .from("gold_loan")
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
