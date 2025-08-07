import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './env';
import authRouter from './routes/auth';

const app = express();
const PORT = config.PORT;

app.use(cors({
  origin: config.CLIENT_URL,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRouter);


app.get('/', (_req, res) => {
  res.send('Hello, world!');
});


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
