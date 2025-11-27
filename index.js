const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Create express app FIRST
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Import Routes AFTER app is created
const usersRoutes = require('./routes/users');
const loansRoutes = require('./routes/loans');
const officerRoutes = require('./routes/officers');
const officerDashboardRoutes = require('./routes/officer_dashboard');
const loanLogsRoutes = require('./routes/loan_logs');
const assetsRoutes = require('./routes/assets');
const aiAnalysisRoutes = require('./routes/ai_analysis');

const homeLoanRoutes = require('./routes/home_loan');
const personalLoanRoutes = require('./routes/personal_loan');
const vehicleLoanRoutes = require('./routes/vehicle_loan');
const educationLoanRoutes = require('./routes/education_loan');
const goldLoanRoutes = require('./routes/gold_loan');
const agricultureLoanRoutes = require('./routes/agriculture_loan');

// NOW use routes (AFTER imports & AFTER app initialization)
app.use('/api/users', usersRoutes);
app.use('/api/loans', loansRoutes);
app.use('/api/officers', officerRoutes);
app.use('/api/officer-dashboard', officerDashboardRoutes);
app.use('/api/loan-logs', loanLogsRoutes);
app.use('/api/assets', assetsRoutes);
app.use('/api/ai-analysis', aiAnalysisRoutes);

app.use('/api/home-loan', homeLoanRoutes);
app.use('/api/personal-loan', personalLoanRoutes);
app.use('/api/vehicle-loan', vehicleLoanRoutes);
app.use('/api/education-loan', educationLoanRoutes);
app.use('/api/gold-loan', goldLoanRoutes);
app.use('/api/agriculture-loan', agricultureLoanRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    db: 'connected'
  });
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
