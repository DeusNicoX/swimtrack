import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { swaggerSpec } from './config/swagger.js';
import authRoutes from './routes/auth.routes.js';
import servicesRoutes from './routes/services.routes.js';

const app = express();

app.use(cors(env.corsOrigin ? { origin: env.corsOrigin } : {}));
app.use(express.json());
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.json({ message: 'SwimTrack API' });
});

app.get('/api/health', (req, res) => {
  res.json({
    environment: env.nodeEnv,
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);

export default app;
