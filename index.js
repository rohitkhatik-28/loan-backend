// index.js (Main Server - FINAL WORKING CODE)
require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();

app.use(express.json());

// Supabase client (Uses keys from .env)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Middleware & Routes Import
const requireAuth = require('./middlewares/auth');

// ✅ Routes Import (सभी सक्रिय हैं)
const usersRouter = require('./routes/users')(supabase, requireAuth); 
const officersRouter = require('./routes/officers')(supabase, requireAuth);
const loansRouter = require('./routes/loans')(supabase, requireAuth);      
const assetsRouter = require('./routes/assets')(supabase, requireAuth);   
const aiRouter = require('./routes/ai_analysis')(supabase, requireAuth); 
const logsRouter = require('./routes/loan_logs')(supabase, requireAuth); 


// ✅ Mount Routes (सभी /api पर सक्रिय हैं)
app.use('/api/users', usersRouter);
app.use('/api/officers', officersRouter);
app.use('/api/loans', loansRouter);
app.use('/api/assets', assetsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/logs', logsRouter);


// ✅ Test route (Only root /)
app.get('/', (req, res) => res.send('Backend is running and all APIs are mounted ✅'));

// ❌ Error Handler (Cannot GET/404 handling)
app.use((req, res, next) => {
    if (req.originalUrl !== '/') {
        res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}. Route not found.` });
        return;
    }
    next();
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));