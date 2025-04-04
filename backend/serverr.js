const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// CORS Configuration - Allow requests from your HTML page
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Body Parser Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Static Files
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
const MONGODB_URI = 'mongodb://127.0.0.1:27017/uzhavan_connect';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('🔥 MongoDB Connected Successfully!'))
.catch(err => console.error('MongoDB connection error:', err));

// Product Model
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  price: { type: Number, required: true },
  deliveryOption: { type: String, default: 'no' },
  location: { type: String, required: true },
  imageUrl: { type: String }
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

// File Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'uploads');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only image files are allowed!'));
  }
}).single('image');

// API Routes - Make sure this endpoint matches what's in your HTML form
app.post('/products', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ 
        success: false,
        message: err.message 
      });
    }

    try {
      const { name, quantity, price, deliveryOption, location } = req.body;
      
      if (!name || !quantity || !price || !location) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ 
          success: false,
          message: 'Missing required fields' 
        });
      }

      const product = new Product({
        name,
        quantity,
        price: Number(price), // Convert price to number
        deliveryOption,
        location,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null
      });

      await product.save();
      
      res.status(201).json({ 
        success: true,
        message: 'Product added successfully',
        product 
      });
    } catch (error) {
      if (req.file) fs.unlinkSync(req.file.path);
      res.status(500).json({ 
        success: false,
        message: 'Error adding product',
        error: error.message 
      });
    }
  });
});

// Also keep the original API endpoint for compatibility
app.post('/api/v1/products', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ 
        success: false,
        message: err.message 
      });
    }

    try {
      const { name, quantity, price, deliveryOption, location } = req.body;
      
      if (!name || !quantity || !price || !location) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ 
          success: false,
          message: 'Missing required fields' 
        });
      }

      const product = new Product({
        name,
        quantity,
        price: Number(price),
        deliveryOption,
        location,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null
      });

      await product.save();
      
      res.status(201).json({ 
        success: true,
        message: 'Product added successfully',
        product 
      });
    } catch (error) {
      if (req.file) fs.unlinkSync(req.file.path);
      res.status(500).json({ 
        success: false,
        message: 'Error adding product',
        error: error.message 
      });
    }
  });
});

// Get all products
app.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Product.countDocuments();
    
    res.json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// Keep the original endpoint for compatibility
app.get('/api/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Product.countDocuments();
    
    res.json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

app.get('/api/health', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ 
      status: 'OK',
      database: 'Connected' 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR',
      error: error.message 
    });
  }
});

// Serve HTML file (optional - if you want to serve your HTML from the same server)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!'
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});