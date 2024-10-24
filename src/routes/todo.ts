import { Router } from 'express';
import { 
    createTodo, 
    updateTodo, 
    deleteTodo, 
    assignTodo, 
    updateTodoStatus, 
    getTodoDetails, 
    getAllTodos, 
    getAllTeamTodos
} from '../controllers/todo';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { constants } from '../data'; 

const router = Router();
const base_url = '/api/todos'
/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Team lead creates a todo within the team
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               teamId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Todo created successfully
 *       400:
 *         description: Bad request
 */
router.post(`${base_url}`, authenticate, authorize([constants.USER_ROLE.TEAM_LEAD]), createTodo);

/**
 * @swagger
 * /todos/{todoId}:
 *   put:
 *     summary: Team lead updates todo details
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: todoId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *       400:
 *         description: Bad request
 */
router.put(`${base_url}/:todoId`, authenticate, authorize([constants.USER_ROLE.TEAM_LEAD]), updateTodo);

/**
 * @swagger
 * /teams/{teamId}/todos/{todoId}:
 *   delete:
 *     summary: Team lead deletes a todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: todoId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Todo deleted successfully
 *       404:
 *         description: Todo not found
 *       400:
 *         description: Bad request
 */
router.delete(`${base_url}/:todoId`, authenticate, authorize([constants.USER_ROLE.TEAM_LEAD]), deleteTodo);

/**
 * @swagger
 * /todos/{todoId}/users/{userId}:
 *   put:
 *     summary: Team lead assigns todo to a user within the team
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: todoId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Todo assigned successfully
 *       404:
 *         description: Todo or User not found
 *       400:
 *         description: Bad request
 */
router.put(`${base_url}/:todoId/users/:userId`, authenticate, authorize([constants.USER_ROLE.TEAM_LEAD]), assignTodo);

/**
 * @swagger
 * /todos/{todoId}/status:
 *   put:
 *     summary: User updates the status of their assigned todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: todoId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       404:
 *         description: Todo not found
 *       400:
 *         description: Bad request
 */
router.put(`${base_url}/:todoId/status`, authenticate, authorize([constants.USER_ROLE.TEAM_USER, constants.USER_ROLE.TEAM_LEAD]), updateTodoStatus);

/**
 * @swagger
 * /todos/{todoId}:
 *   get:
 *     summary: Fetch specific todo details
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: todoId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Todo details fetched successfully
 *       404:
 *         description: Todo not found
 *       400:
 *         description: Bad request
 */
router.get(`${base_url}/:todoId`, authenticate, authorize([constants.USER_ROLE.TEAM_USER, constants.USER_ROLE.TEAM_LEAD, constants.USER_ROLE.ADMIN]), getTodoDetails);

/**
 * @swagger
 * /teams/{teamId}/todos:
 *   get:
 *     summary: Fetch all todos for a specific team
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: teamId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *          description: Todos fetched successfully                  
 *       404:
 *         description: Team not found
 *       400:
 *         description: Bad request
 */
router.get(`${base_url}/teams/:teamId`, authenticate, authorize([constants.USER_ROLE.TEAM_LEAD, constants.USER_ROLE.ADMIN]), getAllTeamTodos);

/**
 * @swagger
 * /teams/{teamId}/todos:
 *   get:
 *     summary: Fetch all todos for a specific team
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *          description: Todos fetched successfully                  
 *       404:
 *         description: Team not found
 *       400:
 *         description: Bad request
 */
router.get(`${base_url}`, authenticate, authorize([constants.USER_ROLE.ADMIN]), getAllTodos);

export default {
    filePath: '/todo',
    path: `${base_url}/*`,
    router,
};
