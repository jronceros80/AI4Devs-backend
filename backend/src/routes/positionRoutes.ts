import { Router } from 'express';
import { getCandidatesByPositionId } from '../presentation/controllers/positionController';

const router = Router();

/**
 * @route GET /positions/:id/candidates
 * @desc Obtiene todos los candidatos asociados a una posición específica
 * @access Public
 */
router.get('/:id/candidates', getCandidatesByPositionId);

export default router; 