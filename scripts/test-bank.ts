import express from 'express';
import { testCoreBanking } from '@banking-sim/core-banking';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: testCoreBanking(),
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`Test bank server running at http://localhost:${port}`);
});
