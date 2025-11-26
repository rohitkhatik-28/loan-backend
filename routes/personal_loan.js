// routes/personal_loan.js
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
personal_loan table fields:
id, loan_id (FK), purpose, annual_income, credit_score,
loan_amount, interest_rate, duration
*/

// ===============================
// 1) Create Personal Loan Detail
// POST /api/personal-loan
// ===============================
router.post('/', async (req, res) => {
  try {
    const {
      loan_id,
      purpose,
      annual_income,
      credit_score,
      loan_amount,
      interest_rate,
      duration,
    } = req.body;

    if (!loan_id) {
      return res.status(400).json({ message: "loan_id is required" });
    }

    const { data, error } = await supabase
      .from("personal_loan")
      .insert([
        {
          loan_id,
          purpose,
          annual_income,
          credit_score,
          loan_amount,
          interest_rate,
          duration
        }
      ])
      .select("*")
      .single();

    if (error) return res.status(500).json({ message: error.message });

    res.status(201).json({
      ...data,
      loan_amount_in_inr: formatINR(data.loan_amount),
      annual_income_in_inr: formatINR(data.annual_income),
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// 2) Get all personal loan records
// GET /api/personal-loan
// ===============================
router.get('/', async (req, res) => {
  try {
    const { loan_id } = req.query;

    let query = supabase.from("personal_loan").select("*");

    if (loan_id) query = query.eq("loan_id", loan_id);

    const { data, error } = await query;

    if (error) return res.status(500).json({ message: error.message });

    const result = data.map(item => ({
      ...item,
      loan_amount_in_inr: formatINR(item.loan_amount),
      annual_income_in_inr: formatINR(item.annual_income),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// 3) Get single personal loan detail
// GET /api/personal-loan/:loanId
// ===============================
router.get('/:loanId', async (req, res) => {
  try {
    const { loanId } = req.params;

    const { data, error } = await supabase
      .from("personal_loan")
      .select("*")
      .eq("loan_id", loanId)
      .single();

    if (error) return res.status(404).json({ message: "Personal loan detail not found" });

    res.json({
      ...data,
      loan_amount_in_inr: formatINR(data.loan_amount),
      annual_income_in_inr: formatINR(data.annual_income),
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// 4) Update personal loan detail
// PUT /api/personal-loan/:loanId
// ===============================
router.put('/:loanId', async (req, res) => {
  try {
    const { loanId } = req.params;

    const updateFields = { ...req.body };

    const { data, error } = await supabase
      .from("personal_loan")
      .update(updateFields)
      .eq("loan_id", loanId)
      .select("*")
      .single();

    if (error) return res.status(500).json({ message: error.message });

    res.json({
      ...data,
      loan_amount_in_inr: formatINR(data.loan_amount),
      annual_income_in_inr: formatINR(data.annual_income),
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
