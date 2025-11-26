// routes/officer_dashboard.js
const express = require("express");
const supabase = require("../supabaseClient");
const auth = require("../middlewares/auth");

const router = express.Router();

/*
This file includes officer-only secure APIs:
- Pending loans
- Approved loans
- Rejected loans
- Update loan status
- Add loan status log
*/

// ================================
// 1) Get PENDING LOANS
// GET /api/officer-dashboard/pending
// ================================
router.get("/pending", auth, async (req, res) => {
  try {
    const { branch_name } = req.officer; // officer info from JWT

    const { data, error } = await supabase
      .from("loans")
      .select("*")
      .eq("status", "applied")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ message: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================================
// 2) Get APPROVED LOANS
// GET /api/officer-dashboard/approved
// ================================
router.get("/approved", auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("loans")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ message: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================================
// 3) Get REJECTED LOANS
// GET /api/officer-dashboard/rejected
// ================================
router.get("/rejected", auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("loans")
      .select("*")
      .eq("status", "rejected")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ message: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================================
// 4) Officer UPDATE loan status
// PATCH /api/officer-dashboard/update-status/:loanId
// ================================
router.patch("/update-status/:loanId", auth, async (req, res) => {
  try {
    const { loanId } = req.params;
    const { status, remarks } = req.body;

    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }

    const officerId = req.officer.id;

    // 1) Update loan status
    const { data, error } = await supabase
      .from("loans")
      .update({
        status,
        remarks,
        approved_by: officerId,
        updated_at: new Date(),
      })
      .eq("id", loanId)
      .select("*")
      .single();

    if (error) return res.status(500).json({ message: error.message });

    // 2) Add status log entry
    await supabase.from("loan_status_logs").insert([
      {
        loan_id: loanId,
        officer_id: officerId,
        action: status,
        remarks,
      },
    ]);

    res.json({
      message: "Status updated",
      loan: data,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
