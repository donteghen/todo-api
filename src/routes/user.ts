import { Router } from 'express';
import { 
    signUp, 
    approveUser, 
    deleteUser, 
    getUserDetails, 
    getAllUsers 
} from '../controllers/user';
import { authenticate } from '../middleware/authenticate'; // Adjust the import path
import { authorize } from '../middleware/authorize'; // Adjust the import path
import { constants } from '../data'; // Adjust the import path according to your project structure

const router = Router();
const base_url = '/api/users'
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Register a user account
 *     tags: [Users]    
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User approved successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad request
 */
router.post(`${base_url}`,  signUp);

/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     summary: Admin approves user account
 *     tags: [Users]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to approve
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User approved successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad request
 */
router.put(`${base_url}/:userId`, authenticate, authorize([constants.USER_ROLE.ADMIN]), approveUser);

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Admin deletes user account
 *     tags: [Users]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad request
 */
router.delete(`${base_url}/:userId`, authenticate, authorize([constants.USER_ROLE.ADMIN]), deleteUser);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get specific user details
 *     tags: [Users]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to fetch
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad request
 */
router.get(`${base_url}/:userId`, authenticate, authorize([constants.USER_ROLE.ADMIN]), getUserDetails);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Admin fetches all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *       400:
 *         description: Bad request
 */
router.get(`${base_url}/`, authenticate, authorize([constants.USER_ROLE.ADMIN]), getAllUsers);

export default {
    filePath: '/user',
    path: `${base_url}/*`,
    router,
};
