import { PrismaClient } from '@prisma/client';
import { Position } from '../../domain/models/Position';

const prisma = new PrismaClient();

/**
 * Obtiene todos los candidatos asociados a una posición específica
 * @param positionId ID de la posición
 * @returns Array de candidatos con su información, etapa actual y puntuación media
 */
export const findCandidatesByPositionId = async (positionId: number) => {
  // Primero verificamos que la posición existe
  const position = await Position.findOne(positionId);
  if (!position) {
    throw new Error('Position not found');
  }

  // Obtenemos todas las aplicaciones para esta posición con sus relaciones
  const applications = await prisma.application.findMany({
    where: {
      positionId: positionId
    },
    include: {
      candidate: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      },
      interviewStep: {
        select: {
          id: true,
          name: true
        }
      },
      interviews: {
        select: {
          score: true
        },
        where: {
          score: {
            not: null
          }
        }
      }
    },
    distinct: ['candidateId'] // Evitar duplicados por candidato
  });

  // Definir la interfaz para la aplicación
  interface ApplicationData {
    candidateId: number;
    candidate: {
      firstName: string;
      lastName: string;
    };
    currentInterviewStep: number;
    interviewStep: {
      id: number;
      name: string;
    };
    interviews: {
      score: number | null;
    }[];
  }

  // Transformamos los datos para la respuesta
  const candidatesData = applications.map((application: any) => {
    // Calculamos la puntuación media si hay entrevistas con puntuación
    let averageScore = null;
    if (application.interviews.length > 0) {
      const totalScore = application.interviews.reduce((sum: number, interview: { score: number | null }) => 
        sum + (interview.score || 0), 0);
      averageScore = totalScore / application.interviews.length;
    }
    
    return {
      candidateId: application.candidateId,
      fullName: `${application.candidate.firstName} ${application.candidate.lastName}`,
      currentInterviewStep: {
        id: application.currentInterviewStep,
        name: application.interviewStep.name
      },
      averageScore: averageScore
    };
  });

  return candidatesData;
}; 