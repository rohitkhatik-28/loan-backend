// routes/assets.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();
const upload = multer({ dest: 'tmp/' });

module.exports = (supabase, requireAuth) => {
  router.get('/', requireAuth, async (req, res) => {
    const { loan_id } = req.query;
    let q = supabase.from('assets').select('*');
    if (loan_id) q = q.eq('loan_id', loan_id);
    const { data, error } = await q;
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  });

  router.post('/upload', requireAuth, upload.single('file'), async (req, res) => {
    const file = req.file;
    const path = `uploads/${Date.now()}_${file.originalname}`;
    const fileBuffer = fs.readFileSync(file.path);

    const { error } = await supabase.storage.from('uploads').upload(path, fileBuffer, {
      contentType: file.mimetype,
    });

    fs.unlinkSync(file.path);
    if (error) return res.status(400).json({ error: error.message });

    const { data: publicUrl } = await supabase.storage.from('uploads').getPublicUrl(path);

    const { data: record, error: dbError } = await supabase
      .from('assets')
      .insert([{ file_url: publicUrl.publicUrl, uploaded_by: req.user.id }])
      .select();

    if (dbError) return res.status(400).json({ error: dbError.message });

    res.json({ message: 'File uploaded', data: record });
  });

  return router;
};
