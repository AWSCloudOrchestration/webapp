import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import morgan from 'morgan';

const app = express();

app.use(cors());
app.use(morgan('combined'));
app.use(express.json()); // Parse json
app.use(express.urlencoded({ extended: true }));
//Load routes
routes(app);

// Healthcheck endpoint
app.get('/healthz', (req, res) => {
    res.sendStatus(200);
})

export default app;
