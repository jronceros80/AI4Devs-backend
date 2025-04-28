import { Request, Response } from 'express';
import { addCandidate, findCandidateById } from '../../application/services/candidateService';
import { updateCandidateStage } from '../../application/services/applicationService';

export const addCandidateController = async (req: Request, res: Response) => {
    try {
        const candidateData = req.body;
        const candidate = await addCandidate(candidateData);
        res.status(201).json({ message: 'Candidate added successfully', data: candidate });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Error adding candidate', error: error.message });
        } else {
            res.status(400).json({ message: 'Error adding candidate', error: 'Unknown error' });
        }
    }
};

export const getCandidateById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        const candidate = await findCandidateById(id);
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Controlador para actualizar la etapa de entrevista de un candidato
 * @param req Request de Express con el ID del candidato en los parámetros y la nueva etapa en el cuerpo
 * @param res Response de Express
 */
export const updateCandidateStageController = async (req: Request, res: Response) => {
    try {
        const candidateId = parseInt(req.params.id);
        const { stageId } = req.body;

        // Validar que el ID del candidato es un número válido
        if (isNaN(candidateId)) {
            return res.status(400).json({
                error: 'Invalid candidate ID format. Please provide a valid number.'
            });
        }

        // Validar que el ID de la etapa está presente y es un número
        if (!stageId || isNaN(parseInt(stageId.toString()))) {
            return res.status(400).json({
                error: 'Invalid or missing stage ID. Please provide a valid stage ID in the request body.'
            });
        }

        const newStageId = parseInt(stageId.toString());
        
        // Actualizar la etapa del candidato
        const updatedApplication = await updateCandidateStage(candidateId, newStageId);
        
        // Retornar respuesta exitosa con la información actualizada
        return res.status(200).json({
            message: 'Candidate stage updated successfully',
            data: updatedApplication
        });
    } catch (error) {
        // Manejar diferentes tipos de errores
        if (error instanceof Error) {
            const errorMessage = error.message;
            
            if (errorMessage === 'Candidate not found') {
                return res.status(404).json({
                    error: 'Candidate not found. Please check the candidate ID and try again.'
                });
            }
            
            if (errorMessage === 'Interview step not found') {
                return res.status(404).json({
                    error: 'The specified interview stage does not exist. Please provide a valid stage ID.'
                });
            }
            
            if (errorMessage === 'No application found for this candidate') {
                return res.status(404).json({
                    error: 'The candidate does not have any active applications.'
                });
            }
            
            // Error genérico con mensaje específico
            return res.status(500).json({
                error: 'Internal server error',
                message: errorMessage
            });
        }
        
        // Error genérico desconocido
        return res.status(500).json({
            error: 'An unexpected error occurred while processing your request.'
        });
    }
};

export { addCandidate };