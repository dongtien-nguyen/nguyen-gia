// routes/categories.js      (Updated to use async/await)
import { Router } from 'express';
import fs from 'fs/promises'; // Use the promise-based version
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const filePath = path.join(__dirname, '..', 'data', 'categories.json');

/* ---------- GET /api/categories ---------- */
router.get('/', async (_req, res) => {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    const categories = JSON.parse(raw);
    res.json(categories);
  } catch (err) {
    // This single catch block handles both file read errors and JSON parsing errors
    console.error("❌ Lỗi categories:", err);
    res.status(500).json({ error: 'Không thể lấy dữ liệu categories' });
  }
});

export default router;