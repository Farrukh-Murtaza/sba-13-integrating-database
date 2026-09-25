const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/Product");

const router = express.Router();

// *======================================================*
// *READ ALL - Get all products with advanced querying*
// *GET /api/products*
// *======================================================*

router.get("/", async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      sortBy,
      page = 1,
      limit = 10,
    } = req.query;

    // Build query dynamically
    const query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Pagination
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Sorting
    let sort = {};

    if (sortBy === "price_asc") {
      sort.price = 1;
    } else if (sortBy === "price_desc") {
      sort.price = -1;
    }

    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNumber);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
      error_code: "INTERNAL_SERVER_ERROR",
    });
  }
});

// *======================================================*
// *CREATE - Create a new product*
// *POST /api/products*
// *======================================================*

router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    console.error(error);

    // Mongoose validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Product validation failed.",
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
      error_code: "INTERNAL_SERVER_ERROR",
    });
  }
});

// *======================================================*
// *READ ONE - Get a single product by ID*
// *GET /api/products/:id*
// *======================================================*

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
        error_code: "INVALID_PRODUCT_ID",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
        error_code: "PRODUCT_NOT_FOUND",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
      error_code: "INTERNAL_SERVER_ERROR",
    });
  }
});

// *======================================================*
// *UPDATE - Update a product by ID*
// *PUT /api/products/:id*
// *======================================================*

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
        error_code: "INVALID_PRODUCT_ID",
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
        error_code: "PRODUCT_NOT_FOUND",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error(error);

    // Mongoose validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Product validation failed.",
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
      error_code: "INTERNAL_SERVER_ERROR",
    });
  }
});

// *======================================================*
// *DELETE - Delete a product by ID*
// *DELETE /api/products/:id*
// *======================================================*

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
        error_code: "INVALID_PRODUCT_ID",
      });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
        error_code: "PRODUCT_NOT_FOUND",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
      error_code: "INTERNAL_SERVER_ERROR",
    });
  }
});

module.exports = router;