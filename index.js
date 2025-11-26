const officerDashboardRoutes = require('./routes/officer_dashboard');
app.use('/api/officer-dashboard', officerDashboardRoutes);

const officersRoutes = require('./routes/officers');
app.use('/api/officers', officersRoutes);

const loanLogsRoutes = require('./routes/loan_logs');
app.use('/api/loan-logs', loanLogsRoutes);


const aiAnalysisRoutes = require('./routes/ai_analysis');
app.use('/api/ai-analysis', aiAnalysisRoutes);


const assetsRoutes = require('./routes/assets');
app.use('/api/assets', assetsRoutes);

const agricultureLoanRoutes = require('./routes/agriculture_loan');
app.use('/api/agriculture-loan', agricultureLoanRoutes);

const goldLoanRoutes = require('./routes/gold_loan');
app.use('/api/gold-loan', goldLoanRoutes);

const educationLoanRoutes = require('./routes/education_loan');
app.use('/api/education-loan', educationLoanRoutes);

const vehicleLoanRoutes = require('./routes/vehicle_loan');
app.use('/api/vehicle-loan', vehicleLoanRoutes);

const homeLoanRoutes = require('./routes/home_loan');
app.use('/api/home-loan', homeLoanRoutes);

const personalLoanRoutes = require('./routes/personal_loan');
app.use('/api/personal-loan', personalLoanRoutes);


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const supabase = require('./supabaseClient');

// Routes (abhi sirf users + loans use karenge, baaki baad me step-by-step)
const usersRoutes = require('./routes/users');
const loansRoutes = require('./routes/loans');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/health', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    if (error) throw error;

    res.json({
      status: 'ok',
      db: 'connected',
      sampleUser: data?.[0] || null,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      error: err.message,
    });
  }
});

// Mount Routes
app.use('/api/users', usersRoutes);
app.use('/api/loans', loansRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
