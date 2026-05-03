import cors from 'cors';
import express from 'express';
import authRoutes from './routes/auth.routes.js';
import servicesRoutes from './routes/services.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'SwimTrack API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);

export default app;
