// routes/assets.js
const express = require('express');
const supabase = require('../supabaseClient');
const router = express.Router();

// ===============================
// UPLOAD FILE (Flutter/App side se base64 aayega)
// POST /api/assets/upload
// ===============================
router.post('/upload', async (req, res) => {
  try {
    const { loan_id, asset_name, asset_description, base64_file } = req.body;

    if (!loan_id || !base64_file) {
      return res.status(400).json({
        message: "loan_id and base64_file are required",
      });
    }

    // Unique File Name
    const fileName = `loan_${loan_id}_${Date.now()}.png`;

    // Convert base64 → buffer
    const fileBuffer = Buffer.from(base64_file, "base64");

    // Upload to storage bucket
    const { error: uploadError } = await supabase.storage
      .from("loan-assets") // BUCKET NAME
      .upload(fileName, fileBuffer, {
        contentType: "image/png",
      });

    if (uploadError) {
      console.log(uploadError);
      return res.status(500).json({ message: "Upload failed", error: uploadError.message });
    }

    // Get PUBLIC URL
    const { data: urlData } = supabase.storage
      .from("loan-assets")
      .getPublicUrl(fileName);

    const file_url = urlData.publicUrl;

    // Save in database
    const { data, error } = await supabase
      .from("assets")
      .insert([
        {
          loan_id,
          asset_name,
          asset_description,
          file_url,
          uploaded_by: "mobile_app"
        },
      ])
      .select("*")
      .single();

    if (error) {
      return res.status(500).json({ message: "DB insert failed", error: error.message });
    }

    res.status(201).json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// GET all assets for a loan
// GET /api/assets/:loanId
// ===============================
router.get('/:loanId', async (req, res) => {
  try {
    const { loanId } = req.params;

    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .eq("loan_id", loanId)
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ message: error.message });

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// GET single asset
// GET /api/assets/view/:id
// ===============================
router.get('/view/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return res.status(404).json({ message: "Asset not found" });

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
