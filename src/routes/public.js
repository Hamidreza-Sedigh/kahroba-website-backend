// routes/public.js
const express = require('express');
const router = express.Router();
const { createContact, reportProblem } = require('../controllers/contactusController');

router.post('/contact', createContact);
router.post('/report-problem', reportProblem);

module.exports = router;
