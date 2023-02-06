import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import morgan from 'morgan';
import errorHandlerMiddleware from './middlewares/error.middleware.js';

const app = express();

app.use(cors());
app.use(morgan('combined'));
app.use(express.json()); // Parse json
app.use(express.urlencoded({ extended: true }));
// Load routes
routes(app);
app.use(errorHandlerMiddleware);
// Centralized error handler
app.use((err, req, res, next) => {
  centralErrorHandler(err, res);
});

// Healthcheck endpoint
app.get('/healthz', (req, res) => {
  res.sendStatus(200);
});

export default app;
