import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import aiSummaryRoute from './routes/aiSummaryRoute.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());

app.use(bodyParser.json());
app.use('/', aiSummaryRoute);
// app.use('/', openaiSummaryRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
