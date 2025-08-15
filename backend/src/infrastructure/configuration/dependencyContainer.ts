import { PostgreSqlCandidateRepository } from '@infrastructure/PostgreSqlCandidateRepository.adapter.js';
import { CreateCandidateUseCase } from '@application/CreateCandidate.usecase.js';
import { CreateCandidateController } from '@infrastructure/controllers/CreateCandidate.controller.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const candidateRepository = PostgreSqlCandidateRepository.getInstance(prisma);
const createCandidateUseCase = new CreateCandidateUseCase(candidateRepository);
const createCandidateController = CreateCandidateController.getInstance(createCandidateUseCase);

export { prisma, candidateRepository, createCandidateUseCase, createCandidateController };
