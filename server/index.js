import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {config } from 'dotenv';
import {router as searchRouter} from './routes/search.js';
import {router as tracksRouter} from './routes/songs.js';
import {router as newRouter} from './routes/new_releases.js';

config()

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());

// Routes
app.use('/api/search', searchRouter);
app.use('/api/songs', tracksRouter);
app.use('/api/new_releases', newRouter);

// Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
