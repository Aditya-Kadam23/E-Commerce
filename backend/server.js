import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'
import dotenv from "dotenv"
import paymentRoutes from "./routes/paymentRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoutes.js"

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('ShopEase backend is running ✅')
})

connectDB();

// CORS — allow local dev AND deployed Vercel frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL, // set this to your Vercel URL on Render
].filter(Boolean); // removes undefined if FRONTEND_URL not set

// app.use(cors({
//   origin: (origin, callback) => {
//     // Allow requests with no origin (Postman, curl, server-to-server)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     }
//     callback(new Error(`CORS blocked: ${origin}`));
//   },
//   credentials: true
// }));

app.use(cors());
// Serve uploaded images as static files (local dev only, prod uses Cloudinary)
if (process.env.NODE_ENV !== 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", paymentRoutes);
app.use("/api", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/user", userRoutes);

app.listen(port, () => {
  console.log(`ShopEase backend running on port ${port}`)
})
