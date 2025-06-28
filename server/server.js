import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

// Since you are using "type": "module" in your client, it's good practice to be consistent.
// If your server/package.json doesn't have "type": "module", you should add it or use require statements instead.
// For this example, I'm assuming "type": "module" in server/package.json.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

// ===== Middleware =====
app.use(cors()); // Cho phép truy cập từ frontend khác origin
app.use(express.json()); // Hỗ trợ parse JSON body
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Truy cập ảnh đã upload

// ===== Routes =====
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));

// --- Serve Static React App ---
// This tells Express to serve any static files from the client's build directory.
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

// This is the catch-all route. It sends back the main index.html file
// for any request that doesn't match one of the API routes or a static file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});
