import express from 'express';
import getSummary from '../utils/aiSummary.js';

const aiSummaryRoute = express.Router();

aiSummaryRoute.post('/summary', async (req, res) => {
    const { employeeList, workDate } = req.body;
    if (!workDate || !employeeList) {
      return res.status(400).json({ error: "Missing workDate or employees" });
    }
    try {
      const summary = await getSummary(workDate, employeeList);
      res.json({ summary });
    } 
    catch (err) {
      console.error("AI summary error:", err);
      res.status(500).json({ error: err.message });
  }
});

export default aiSummaryRoute;

