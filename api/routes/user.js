const express = require('express');
const res = require('express/lib/response');
const router = express.Router();

const UserController = require('../controllers/user');
const checkAuth  = require('../middleware/check-auth');

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: User Signup
 *     description: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request, invalid input
 *       500:
 *         description: Internal server error
 */

router.post('/signup', UserController.user_signup);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User Login
 *     description: Log in as an existing user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized, invalid credentials
 *       500:
 *         description: Internal server error
 */

router.post('/login', UserController.user_login );

/**
 * @swagger
 * /user/{userId}:
 *   delete:
 *     summary: Delete User
 *     description: Delete a user account
 *     security:
 *       - JWTBearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized, authentication token is missing or invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.delete('/:userId', checkAuth, UserController.delete_user);

module.exports = router;