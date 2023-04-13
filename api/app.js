import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import morgan from 'morgan';
import centralErrorHandler from './utils/centralErrorHandler.js';
import errorHandlerMiddleware from './middlewares/error.middleware.js';
import metricsMiddleware from './middlewares/metrics.middleware.js';
import responseHandler from './utils/responseHandler.js';
import ip from 'ip';

const app = express();

app.use(cors());
app.use(morgan('combined'));
app.use(express.json()); // Parse json
app.use(express.urlencoded({ extended: true }));
// Metrics middleware
app.use(metricsMiddleware);
// Load routes
routes(app);
app.use(errorHandlerMiddleware);
// Centralized error handler
app.use((err, req, res, next) => {
  centralErrorHandler(err, res);
});

// Healthcheck endpoint
app.get('/healthz', (req, res) => {
  responseHandler(req, res, null, 200);
});

app.get('/test', (req, res) => {
  responseHandler(req, res, { ip: ip.address(), timestamp: new Date() }, 200);
});

export default app;
