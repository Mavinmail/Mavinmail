import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createTask, getTasks, cancelTask } from '../controllers/tasksController.js';

const router = Router();

router.use(authMiddleware);

router.post('/', createTask);
router.get('/', getTasks);
router.delete('/:id', cancelTask);

export default router;
