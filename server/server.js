import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const staticPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(staticPath));

const app = express();
const PORT = process.env.PORT || 8080;

// ===== Middleware =====
app.use(cors()); // Cho phép truy cập từ frontend khác origin
app.use(express.json()); // Hỗ trợ parse JSON body
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Truy cập ảnh đã upload

// ===== Routes =====
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));

// send index.html for any route React handles
app.get('*', (_req, res) =>
  res.sendFile(path.join(staticPath, 'index.html'))
);

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});
