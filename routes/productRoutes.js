const express = require("express");
const Product = require("../models/Product")
const router = express.Router();


// ====================================================== 
// READ ALL - Get all products
// GET /api/products
// ======================================================
router.get('/', async(req, res) => {
     
    try{
        const products = await Product.find({});
        res.status(200).json({
            success: true,
            products
        });
    }catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
             message: error.message,
             error_code: "INTERNAL_SERVER_ERROR"
        });
    }

 }); 



// ====================================================== 
// CREATE - Create a new product 
// POST /api/products 
// ======================================================
router.post('/', async(req, res) => { 
    try{
        const product = await Product.create(req.body);

        res.status(200).json({
            success: true,
            message: "Product created successfully.",
            product
        });
    
    
    }catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message,
            error_code: "INTERNAL_SERVER_ERROR"
        });
    }
}); 

// ======================================================
// READ ONE - Get a single product by ID 
// GET /api/products/:id 
// ======================================================
router.get('/:id', async(req, res) => {
    try{
        const {id } =req.params;
        const product = await Product.findById(id);

        // Not Found
        if (!product) { 
            return res.status(404).json({
                 success: false, 
                 message: "Product not found.",
                  error_code: "PRODUCT_NOT_FOUND", 
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    }catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
             message: error.message,
             error_code: "INTERNAL_SERVER_ERROR"
        });
    }
 }); 

 // ====================================================== 
// UPDATE - Update a product by ID 
// PUT /api/products/:id
// ======================================================
router.put('/:id', async(req, res) => { 
     try{
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(
             id, req.body, 
            {    new: true,
                 runValidators: true, 
            });
            
        if (!product) {
             return res.status(404).json({
                 success: false, 
                 message: "Product not found.", 
                 error_code: "PRODUCT_NOT_FOUND",
                 });
            } 
            
        res.status(200).json({ 
            success: true,
            message: "product updated successfully.", 
            product,
         });

    }catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
             message: error.message,
             error_code: "INTERNAL_SERVER_ERROR"
        });
    }
}); 

 // ====================================================== 
// DELETE - Delete a product by ID 
// DELETE /api/products/:id 
// ======================================================
router.delete('/:id', async(req, res) => {
    try { 
        const { id } = req.params; 
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
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
             message: error.message,
             error_code: "INTERNAL_SERVER_ERROR"
        });
    }
 }); 


module.exports = router;