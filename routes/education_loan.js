// routes/education_loan.js
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
education_loan table fields:
loan_id, course_name, institute_name,
duration, loan_amount, interest_rate
*/

// ===============================
// 1) CREATE Education Loan Detail
// POST /api/education-loan
// ===============================
router.post('/', async (req, res) => {
  try {
    const {
      loan_id,
      course_name,
      institute_name,
      duration,
      loan_amount,
      interest_rate
    } = req.body;

    if (!loan_id) {
      return res.status(400).json({ message: "loan_id is required" });
    }

    const { data, error } = await supabase
      .from("education_loan")
      .insert([
        {
          loan_id,
          course_name,
          institute_name,
          duration,
          loan_amount,
          interest_rate,
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
// 2) GET All Education Loans
// GET /api/education-loan
// ===============================
router.get('/', async (req, res) => {
  try {
    const { loan_id } = req.query;

    let query = supabase.from("education_loan").select("*");
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
// 3) GET Education Loan by loan_id
// GET /api/education-loan/:loanId
// ===============================
router.get('/:loanId', async (req, res) => {
  try {
    const { loanId } = req.params;

    const { data, error } = await supabase
      .from("education_loan")
      .select("*")
      .eq("loan_id", loanId)
      .single();

    if (error) return res.status(404).json({ message: "Education loan detail not found" });

    res.json({
      ...data,
      loan_amount_in_inr: formatINR(data.loan_amount),
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// 4) UPDATE Education Loan Detail
// PUT /api/education-loan/:loanId
// ===============================
router.put('/:loanId', async (req, res) => {
  try {
    const { loanId } = req.params;

    const updateFields = { ...req.body, updated_at: new Date() };

    const { data, error } = await supabase
      .from("education_loan")
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
