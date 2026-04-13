import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
import Product from '../models/Product.js'
import Review from '../models/Review.js'
import upload from '../middleware/upload.js';
const router = express.Router();
// authMiddleware, adminMiddleware,
// BUG FIX: was missing auth + admin middleware — anyone could add products
router.post("/products", authMiddleware, adminMiddleware, upload.array("images", 5), async (req, res) => {
   try {
      const { name, description, price, category, stock } = req.body;

      if (!name || !description || !category || price === undefined || stock === undefined) {
         return res.status(400).json({ message: "Missing required fields" });
      }

      if (!req.files || req.files.length === 0) {
         return res.status(400).json({ message: "Images are required" });
      }

      const priceNum = Number(price);
      const stockNum = Number(stock);

      if (priceNum <= 0 || stockNum < 0) {
         return res.status(400).json({ message: "Invalid price or stock" });
      }

      const images = req.files.map(file => ({
         url: file.path,
         public_id: file.filename
      }));

      const product = await Product.create({
         name,
         description,
         price: priceNum,
         category,
         stock: stockNum,
         images
      });

      return res.status(201).json({
         message: "Product Added Successfully",
         product
      });

   } catch (error) {
      res.status(500).json({ message: error.message });
   }
});

router.get("/products", async (req, res) => {
   try {
      const { search, category, minPrice, maxPrice, page } = req.query;
      let query = {};

      if (search) {
         query.name = { $regex: search, $options: "i" };
      }
      if (category) {
         query.category = category;
      }
      if (minPrice || maxPrice) {
         query.price = {};
         if (minPrice) query.price.$gte = Number(minPrice);
         if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      const limit = 10;
      const pageNumber = Number(page) || 1;
      const skip = (pageNumber - 1) * limit;
      const allProducts = await Product.find();
      const totalProducts = await Product.countDocuments(query);
      const totalPages = Math.ceil(totalProducts/limit);
      const products = await Product.find(query).skip(skip).limit(limit);

      return res.status(200).json({ message: "Products fetched successfully", page: pageNumber, products,totalPages, totalProducts });

   } catch (error) {
      res.status(500).json({ message: error.message });
   }
});

router.get("/products/:id", async (req, res) => {
   try {
      const productId = req.params.id;

      const product = await Product.findById(productId);
      if (!product) {
         return res.status(404).json({ message: "product not found" });
      }
      return res.status(200).json({ message: "product fetched successfully", product });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
});

router.put("/products/:id", authMiddleware, adminMiddleware, async (req, res) => {
   try {
      const productId = req.params.id;
      const product = await Product.findById(productId);
      if (!product) {
         return res.status(404).json({ message: "Product not found" });
      }
      const updatedProduct = await Product.findByIdAndUpdate(
         productId,
         req.body,
         { new: true }
      );
      return res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }

});

// BUG FIX: was missing auth + admin middleware — anyone could delete products
router.delete("/products/:id", authMiddleware, adminMiddleware, async (req, res) => {
   try {
      const productId = req.params.id;
      const product = await Product.findById(productId);
      if (!product) {
         return res.status(404).json({ message: "Product not found" });
      }
      await Product.findByIdAndDelete(productId);
      return res.status(200).json({ message: "Product deleted successfully" });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
});

router.post("/products/:id/reviews", authMiddleware, async (req, res) => {
   try {
      const { rating, comment } = req.body;
      if (!rating || rating < 1 || rating > 5) {
         return res.status(400).json({ message: "improper required fields" });
      }
      const userId = req.user.id;
      const productId = req.params.id;
      const product = await Product.findById(productId);
      if (!product) {
         return res.status(404).json({ message: "product not found" });
      }
      const existingReview = await Review.findOne({ user: userId, product: productId });
      if (existingReview) {
         return res.status(405).json({ message: "Not allowed to review again" });
      }
      const review = await Review.create({
         user: userId,
         product: productId,
         rating,
         comment
      });
      const reviews = await Review.find({ product: productId });
      product.numReviews = reviews.length;
      product.rating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;
      await product.save();
      return res.status(200).json({ message: "Reviewed successfully", review });

   } catch (error) {
      res.status(500).json({ message: error.message });
   }

});

router.get("/products/:id/reviews", async (req, res) => {
   try {
      const productId = req.params.id;
      const product = await Product.findById(productId);
      if (!product) {
         return res.status(404).json({ message: "Product not found" });
      }
      const reviews = await Review.find({ product: productId }).populate("user", "name");
      const avgRating = product.rating;
      const totalReviews = product.numReviews;
      return res.status(200).json({ message: "Reviews fetched successfully", reviews, avgRating, totalReviews });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }

});

router.put("/reviews/:reviewId", authMiddleware, async (req, res) => {
   try {
      const reviewId = req.params.reviewId;
      const review = await Review.findById(reviewId);

      if (!review) {
         return res.status(404).json({ message: "Review not found" });
      }
      if (review.user.toString() !== req.user.id) {
         return res.status(403).json({ message: "Not Authorized" });
      }
      const { rating, comment } = req.body;

      review.rating = rating ?? review.rating;
      review.comment = comment ?? review.comment;
      await review.save();
      const product = await Product.findById(review.product);
      const reviews = await Review.find({ product: review.product });

      product.rating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;
      product.numReviews = reviews.length;
      await product.save();
      return res.status(200).json({ message: "Review updated successfully", review })
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
});

router.delete("/reviews/:reviewId", authMiddleware, async (req, res) => {
   try {
      const reviewId = req.params.reviewId;
      const review = await Review.findById(reviewId);


      if (!review) {
         return res.status(404).json({ message: "review not found" });
      }
      if (review.user.toString() !== req.user.id) {
         return res.status(403).json({ message: "Not authorized" });
      }
      const productId = review.product;
      await Review.findByIdAndDelete(reviewId);
      const reviews = await Review.find({ product: productId });
      const product = await Product.findById(productId);


      if (reviews.length === 0) {
         product.rating = 0;
         product.numReviews = 0;
      }
      else {
         product.rating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;
         product.numReviews = reviews.length;
      }
      await product.save();
      return res.status(200).json({ message: "Review deleted successfully", review });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
});

export default router;