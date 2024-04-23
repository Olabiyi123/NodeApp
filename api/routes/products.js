const express = require('express');
const res = require('express/lib/response');
const router = express.Router();

const multer = require('multer');
const checkAuth  = require('../middleware/check-auth');

const ProductsController = require('../controllers/products');
const app = require('../../app');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + 
        file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    //reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ){
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage : storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter

});

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve all products
 *     description: Retrieve a list of all products
 *     responses:
 *       200:
 *         description: A list of products
 *       500:
 *         description: Internal server error
 */

router.get('/', ProductsController.products_get_all);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     description: Create a new product with name, price, and an optional image
 *     security:
 *       - JWTBearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               productImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Bad request, invalid input
 *       500:
 *         description: Internal server error
 */

router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);

/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     summary: Retrieve a specific product
 *     description: Retrieve a specific product by its ID
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product to retrieve
 *     responses:
 *       200:
 *         description: A single product
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

router.get('/:productId', ProductsController.products_get_product);

/**
 * @swagger
 * /products/{productId}:
 *   patch:
 *     summary: Update a specific product
 *     description: Update a specific product by its ID
 *     security:
 *       - JWTBearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 propName:
 *                   type: string
 *                   description: Name of the property to update
 *                 value:
 *                   type: string
 *                   description: New value for the property
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Bad request, invalid input
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

router.patch('/:productId', checkAuth, ProductsController.products_update_product);

/**
 * @swagger
 * /products/{productId}:
 *   delete:
 *     summary: Delete a specific product
 *     description: Delete a specific product by its ID
 *     security:
 *       - JWTBearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

router.delete('/:productId', checkAuth, ProductsController.products_delete_product);


module.exports = router;