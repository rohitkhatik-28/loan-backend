// routes/ai_analysis.js
const express = require('express');
const supabase = require('../supabaseClient');

const router = express.Router();

/*
ai_analysis table fields:
asset_id, object_detected, text_detected,
authenticity_score, verified_by_ai
*/

// ===============================
// 1) SAVE AI ANALYSIS RESULT
// POST /api/ai-analysis
// ===============================
router.post('/', async (req, res) => {
  try {
    const {
      asset_id,
      object_detected,
      text_detected,
      authenticity_score,
      verified_by_ai = true
    } = req.body;

    if (!asset_id) {
      return res.status(400).json({ message: "asset_id is required" });
    }

    const { data, error } = await supabase
      .from("ai_analysis")
      .insert([
        {
          asset_id,
          object_detected,
          text_detected,
          authenticity_score,
          verified_by_ai,
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
// 2) GET AI Analysis for an asset
// GET /api/ai-analysis/asset/:assetId
// ===============================
router.get('/asset/:assetId', async (req, res) => {
  try {
    const { assetId } = req.params;

    const { data, error } = await supabase
      .from("ai_analysis")
      .select("*")
      .eq("asset_id", assetId)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// 3) GET Single AI Analysis Entry
// GET /api/ai-analysis/:id
// ===============================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("ai_analysis")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({ message: "AI analysis not found" });
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// 4) UPDATE AI ANALYSIS (optional)
// PUT /api/ai-analysis/:id
// ===============================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const updateFields = { ...req.body, updated_at: new Date() };

    const { data, error } = await supabase
      .from("ai_analysis")
      .update(updateFields)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
