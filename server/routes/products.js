// routes/products.js  ——> Updated to use async/await
import { Router } from 'express';
import fs from 'fs/promises'; // Use the promise-based version
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const dataPath = path.join(__dirname, '..', 'data', 'products.json');

// --- Helper functions to read/write data ---
const readData = async () => {
  const raw = await fs.readFile(dataPath, 'utf-8');
  return JSON.parse(raw);
};

const writeData = async (data) => {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
};


/* ---------- Multer setup ---------- */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) =>
    cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (_req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

/* ---------- GET /api/products  (+ search & pagination) ---------- */
router.get('/', async (req, res) => {
  try {
    let products = await readData();
    const { search, category, page = 1, limit = 20 } = req.query;

    if (category) {
      products = products.filter(p =>
        p.category?.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      products = products.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.code?.toLowerCase().includes(search.toLowerCase())
      );
    }

    const pageNum = Number(page);
    const pageSize = Number(limit);
    const total = products.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginated = products.slice((pageNum - 1) * pageSize, pageNum * pageSize);

    res.json({ page: pageNum, limit: pageSize, total, totalPages, products: paginated });
  } catch (e) {
    console.error('❌ Lỗi xử lý dữ liệu:', e);
    res.status(500).json({ error: 'Lỗi định dạng dữ liệu' });
  }
});

/* ---------- POST /api/products ---------- */
router.post('/', async (req, res) => {
  try {
    const newProduct = req.body;
    const products = await readData();

    const duplicate = products.some(
      p =>
        p.code?.toLowerCase() === newProduct.code?.toLowerCase() ||
        p.name?.toLowerCase() === newProduct.name?.toLowerCase()
    );
    if (duplicate) {
      return res.status(400).json({ error: 'Mã hoặc tên đã tồn tại' });
    }
    
    const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const toSave = { id: newId, ...newProduct, price: Number(newProduct.price ?? 0) };

    products.push(toSave);
    await writeData(products);

    res.status(201).json({ message: '✅ Thêm sản phẩm thành công', product: toSave });
  } catch (err) {
    console.error('❌ Lỗi khi thêm sản phẩm:', err);
    res.status(500).json({ error: 'Không thể thêm sản phẩm' });
  }
});

/* ---------- POST /api/products/upload ---------- */
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Không có file được tải lên' });
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

/* ---------- POST /api/products/delete ---------- */
router.post('/delete', async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || !ids.length) {
    return res.status(400).json({ error: 'Danh sách ID không hợp lệ' });
  }

  try {
    const products = await readData();
    const originalCount = products.length;
    const remaining = products.filter(p => !ids.includes(p.id));
    
    await writeData(remaining);
    res.json({ message: `✅ Đã xóa ${originalCount - remaining.length} sản phẩm` });
  } catch (err) {
    console.error('❌ Lỗi khi xóa sản phẩm:', err);
    res.status(500).json({ error: 'Không thể xóa sản phẩm' });
  }
});


/* ---------- POST /api/products/filter is now covered by GET /api/products?search=... ---------- */
// The GET endpoint is more flexible, so the POST /filter is redundant. You can remove it.
// If you still need it, here is the async version:
router.post('/filter', async (req, res) => {
  try {
    let products = await readData();
    const { code, name, category } = req.body;

    if (code) products = products.filter(p => p.code?.toLowerCase().includes(code.toLowerCase()));
    if (name) products = products.filter(p => p.name?.toLowerCase().includes(name.toLowerCase()));
    if (category) products = products.filter(p => p.category?.toLowerCase() === category.toLowerCase());

    res.json(products);
  } catch (e) {
    console.error('❌ Lỗi filter:', e);
    res.status(500).json({ error: 'Lỗi xử lý dữ liệu' });
  }
});

export default router;