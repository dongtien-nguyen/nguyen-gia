// server/server.js  (ES-module style)
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

/* ---------- Middleware ---------- */
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ---------- Serve the React build ---------- */
const staticPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(staticPath));

/* ---------- API routes ---------- */
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);

/* ---------- Client-side routing fallback ---------- */
app.get('*', (_req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

/* ---------- Start server ---------- */
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
