const express = require('express');
const res = require('express/lib/response');
const router = express.Router();

const checkAuth  = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders');

//Handle incoming GET requests to /orders

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Retrieve all orders
 *     description: Retrieve a list of all orders
 *     security:
 *       - JWTBearerAuth: []
 *     responses:
 *       200:
 *         description: A list of orders
 *       401:
 *         description: Unauthorized, authentication token is missing or invalid
 *       500:
 *         description: Internal server error
 */

router.get('/', checkAuth, OrdersController.orders_get_all);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     description: Create a new order with products and quantities
 *     security:
 *       - JWTBearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Bad request, invalid input
 *       401:
 *         description: Unauthorized, authentication token is missing or invalid
 *       500:
 *         description: Internal server error
 */

router.post('/', checkAuth, OrdersController.orders_create_order);

/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     summary: Retrieve a specific order
 *     description: Retrieve a specific order by its ID
 *     security:
 *       - JWTBearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the order to retrieve
 *     responses:
 *       200:
 *         description: A single order
 *       401:
 *         description: Unauthorized, authentication token is missing or invalid
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */

router.get('/:orderId', checkAuth, OrdersController.orders_get_order);

/**
 * @swagger
 * /orders/{orderId}:
 *   delete:
 *     summary: Delete a specific order
 *     description: Delete a specific order by its ID
 *     security:
 *       - JWTBearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the order to delete
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       401:
 *         description: Unauthorized, authentication token is missing or invalid
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */

router.delete('/:orderId', checkAuth, OrdersController.orders_delete_order);

module.exports = router;