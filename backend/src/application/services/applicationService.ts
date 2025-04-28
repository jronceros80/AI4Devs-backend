import { PrismaClient } from '@prisma/client';
import { Application } from '../../domain/models/Application';
import { Candidate } from '../../domain/models/Candidate';
import { InterviewStep } from '../../domain/models/InterviewStep';

const prisma = new PrismaClient();

/**
 * Actualiza la etapa de entrevista actual de un candidato
 * @param candidateId ID del candidato
 * @param newStepId ID de la nueva etapa de entrevista
 * @returns La aplicación actualizada
 */
export const updateCandidateStage = async (candidateId: number, newStepId: number) => {
  // Verificamos que el candidato existe
  const candidate = await Candidate.findOne(candidateId);
  if (!candidate) {
    throw new Error('Candidate not found');
  }

  // Verificamos que la etapa de entrevista existe
  const interviewStep = await prisma.interviewStep.findUnique({
    where: {
      id: newStepId
    }
  });

  if (!interviewStep) {
    throw new Error('Interview step not found');
  }

  // Buscamos la aplicación actual del candidato
  const application = await prisma.application.findFirst({
    where: {
      candidateId: candidateId
    },
    orderBy: {
      applicationDate: 'desc'
    }
  });

  if (!application) {
    throw new Error('No application found for this candidate');
  }

  // Actualizamos la etapa de entrevista en la aplicación
  const updatedApplication = await prisma.application.update({
    where: {
      id: application.id
    },
    data: {
      currentInterviewStep: newStepId
    },
    include: {
      interviewStep: true,
      position: {
        select: {
          title: true
        }
      }
    }
  });

  return {
    applicationId: updatedApplication.id,
    candidateId: updatedApplication.candidateId,
    position: updatedApplication.position.title,
    previousStep: application.currentInterviewStep,
    newStep: {
      id: updatedApplication.interviewStep.id,
      name: updatedApplication.interviewStep.name
    },
    updateTime: new Date()
  };
}; 