import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { pullChanges, restartServer, stopServer, viewLogs, revertCommit } from '../controllers/pm2';
import { constants } from '../data';

const router = Router();
const base_url = '/api/pm2'; 

/**
 * @swagger
 * /pm2/pull:
 *   post:
 *     summary: Pull changes from GitHub.
 *     tags: [PM2 Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pulled changes successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.post(`${base_url}/pull`, authenticate, authorize([constants.USER_ROLE.ADMIN]), pullChanges);

/**
 * @swagger
 * /pm2/restart:
 *   post:
 *     summary: Restart the server.
 *     tags: [PM2 Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Server restarted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.post(`${base_url}/restart`, authenticate, authorize([constants.USER_ROLE.ADMIN]), restartServer);

/**
 * @swagger
 * /pm2/stop:
 *   post:
 *     summary: Stop the server.
 *     tags: [PM2 Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Server stopped successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.post(`${base_url}/stop`, authenticate, authorize([constants.USER_ROLE.ADMIN]), stopServer);

/**
 * @swagger
 * /pm2/logs:
 *   get:
 *     summary: View server logs.
 *     tags: [PM2 Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retrieved server logs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 logs:
 *                   type: string
 */
router.get(`${base_url}/logs`, authenticate, authorize([constants.USER_ROLE.ADMIN]), viewLogs); 

/**
 * @swagger
 * /pm2/revert:
 *   post:
 *     summary: Revert to a previous commit.
 *     tags: [PM2 Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commit:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reverted successfully to the specified commit.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.post(`${base_url}/revert`, authenticate, authorize([constants.USER_ROLE.ADMIN]), revertCommit);

export default {
    filePath: '/pm2',
    path: `${base_url}/*`,
    router,
};
