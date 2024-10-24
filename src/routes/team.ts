import { Router } from 'express';
import { 
    createTeam, 
    updateTeam, 
    deleteTeam, 
    getTeamDetails, 
    getAllTeams, 
    assignTeamLead 
} from '../controllers/team';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { constants } from '../data'; 

const router = Router();
const base_url = '/api/teams';
/**
 * @swagger
 * /teams:
 *   post:
 *     summary: Admin creates a team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Team created successfully
 *       400:
 *         description: Bad request
 */
router.post(base_url, authenticate, authorize([constants.USER_ROLE.ADMIN]), createTeam);

/**
 * @swagger
 * /teams/{teamId}:
 *   put:
 *     summary: Admin updates team details
 *     tags: [Teams]
 *     parameters:
 *       - name: teamId
 *         in: path
 *         required: true
 *         description: ID of the team to update
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Team updated successfully
 *       404:
 *         description: Team not found
 *       400:
 *         description: Bad request
 */
router.put(`${base_url}/:teamId`, authenticate, authorize([constants.USER_ROLE.ADMIN]), updateTeam);

/**
 * @swagger
 * /teams/{teamId}:
 *   delete:
 *     summary: Admin deletes a team
 *     tags: [Teams]
 *     parameters:
 *       - name: teamId
 *         in: path
 *         required: true
 *         description: ID of the team to delete
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Team deleted successfully
 *       404:
 *         description: Team not found
 *       400:
 *         description: Bad request
 */
router.delete(`${base_url}/:teamId`, authenticate, authorize([constants.USER_ROLE.ADMIN]), deleteTeam);

/**
 * @swagger
 * /teams/{teamId}:
 *   get:
 *     summary: Get specific team details
 *     tags: [Teams]
 *     parameters:
 *       - name: teamId
 *         in: path
 *         required: true
 *         description: ID of the team to retrieve
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Team details retrieved successfully
 *       404:
 *         description: Team not found
 *       400:
 *         description: Bad request
 */
router.get(`${base_url}/:teamId`, authenticate, authorize([constants.USER_ROLE.ADMIN, constants.USER_ROLE.TEAM_LEAD]), getTeamDetails);

/**
 * @swagger
 * /teams:
 *   get:
 *     summary: Admin fetches all teams
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of teams retrieved successfully
 *       400:
 *         description: Bad request
 */
router.get(`${base_url}/`, authenticate, authorize([constants.USER_ROLE.ADMIN]), getAllTeams);

/**
 * @swagger
 * /teams/{teamId}/users/{userId}:
 *   put:
 *     summary: Admin assigns or changes the team lead
 *     tags: [Teams]
 *     parameters:
 *       - name: teamId
 *         in: path
 *         required: true
 *         description: ID of the team
 *         schema:
 *           type: string
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to assign as team lead
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Team lead assigned successfully
 *       404:
 *         description: Team or user not found
 *       400:
 *         description: Bad request
 */
router.put(`${base_url}/:teamId/users/:userId`, authenticate, authorize([constants.USER_ROLE.ADMIN]), assignTeamLead);

export default {
    filePath: '/team',
    path: `${base_url}/*`,
    router,
};
