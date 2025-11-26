// routes/loan_logs.js
const express = require('express');
const supabase = require('../supabaseClient');

const router = express.Router();

/*
loan_status_logs fields:
loan_id, officer_id, action, remarks
*/

// ===============================
// 1) ADD NEW LOG ENTRY
// POST /api/loan-logs
// ===============================
router.post('/', async (req, res) => {
  try {
    const { loan_id, officer_id, action, remarks } = req.body;

    if (!loan_id || !action) {
      return res.status(400).json({
        message: "loan_id and action are required"
      });
    }

    const { data, error } = await supabase
      .from("loan_status_logs")
      .insert([
        {
          loan_id,
          officer_id,
          action,
          remarks,
        },
      ])
      .select("*")
      .single();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    res.status(201).json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// 2) GET LOGS FOR ONE LOAN
// GET /api/loan-logs/:loanId
// ===============================
router.get('/:loanId', async (req, res) => {
  try {
    const { loanId } = req.params;

    const { data, error } = await supabase
      .from("loan_status_logs")
      .select("*, officers(name, designation)")
      .eq("loan_id", loanId)
      .order("timestamp", { ascending: false });

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// 3) GET SINGLE LOG ENTRY
// GET /api/loan-logs/view/:id
// ===============================
router.get('/view/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("loan_status_logs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({ message: "Log entry not found" });
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
