// routes/vehicle_loan.js
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
vehicle_loan table fields:
loan_id, vehicle_model, vehicle_type,
loan_amount, interest_rate, duration
*/

// =====================================
// 1) CREATE Vehicle Loan Detail
// POST /api/vehicle-loan
// =====================================
router.post('/', async (req, res) => {
  try {
    const {
      loan_id,
      vehicle_model,
      vehicle_type,
      loan_amount,
      interest_rate,
      duration,
    } = req.body;

    if (!loan_id) {
      return res.status(400).json({ message: "loan_id is required" });
    }

    const { data, error } = await supabase
      .from("vehicle_loan")
      .insert([
        {
          loan_id,
          vehicle_model,
          vehicle_type,
          loan_amount,
          interest_rate,
          duration,
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

// =====================================
// 2) GET All Vehicle Loans
// GET /api/vehicle-loan
// =====================================
router.get('/', async (req, res) => {
  try {
    const { loan_id } = req.query;

    let query = supabase.from("vehicle_loan").select("*");
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

// =====================================
// 3) GET Vehicle Loan by loan_id
// GET /api/vehicle-loan/:loanId
// =====================================
router.get('/:loanId', async (req, res) => {
  try {
    const { loanId } = req.params;

    const { data, error } = await supabase
      .from("vehicle_loan")
      .select("*")
      .eq("loan_id", loanId)
      .single();

    if (error) return res.status(404).json({ message: "Vehicle loan detail not found" });

    res.json({
      ...data,
      loan_amount_in_inr: formatINR(data.loan_amount),
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =====================================
// 4) UPDATE Vehicle Loan Detail
// PUT /api/vehicle-loan/:loanId
// =====================================
router.put('/:loanId', async (req, res) => {
  try {
    const { loanId } = req.params;

    const updateFields = { ...req.body, updated_at: new Date() };

    const { data, error } = await supabase
      .from("vehicle_loan")
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
