import express from 'express';
import Boom from 'boom';
import dotenv from 'dotenv';
import auth from './routes/auth';

dotenv.config();

const PORT = 4000;
const app = express();

app.use(express.json());
app.use('/auth', auth);

app.get('/', async (req, res) => {
  return res.end('hello stranger!');
});

app.use((req, res, next) => {
  return next(Boom.notFound('Not Found'));
});

app.use((err, req, res, next) => {
  if (err) {
    if (err.output) {
      return res.status(err.output.statusCode || 500).json(err.output.payload);
    }
  }
  return res.status(500).json(err);
});

app.listen(PORT, () => console.log(`Server is up and running on port ${PORT}`));
