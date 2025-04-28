import { Request, Response } from 'express';
import { findCandidatesByPositionId } from '../../application/services/positionService';

/**
 * Controlador para obtener todos los candidatos asociados a una posición
 * @param req Request de Express con el ID de la posición en los parámetros
 * @param res Response de Express
 */
export const getCandidatesByPositionId = async (req: Request, res: Response) => {
  try {
    const positionId = parseInt(req.params.id);
    
    // Validar que el ID es un número válido
    if (isNaN(positionId)) {
      return res.status(400).json({ 
        error: 'Invalid position ID format. Please provide a valid number.' 
      });
    }
    
    const candidates = await findCandidatesByPositionId(positionId);
    
    // Devolver los candidatos con un status 200
    return res.status(200).json(candidates);
  } catch (error) {
    // Manejar diferentes tipos de errores
    if (error instanceof Error) {
      if (error.message === 'Position not found') {
        return res.status(404).json({ 
          error: 'Position not found. Please check the position ID and try again.' 
        });
      }
      
      // Error genérico con mensaje específico
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
      });
    }
    
    // Error genérico desconocido
    return res.status(500).json({ 
      error: 'An unexpected error occurred while processing your request.' 
    });
  }
}; 