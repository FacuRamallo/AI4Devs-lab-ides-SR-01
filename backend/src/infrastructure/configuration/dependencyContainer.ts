import { PostgreSqlCandidateRepository } from '../PostgreSqlCandidateRepository.adapter';
import { CreateCandidateUseCase } from '../../application/CreateCandidate.usecase';
import { CreateCandidateController } from '../controllers/CreateCandidate.controller';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const candidateRepository = PostgreSqlCandidateRepository.getInstance(prisma);
const createCandidateUseCase = new CreateCandidateUseCase(candidateRepository);
const createCandidateController = CreateCandidateController.getInstance(createCandidateUseCase);

export { candidateRepository, createCandidateUseCase, createCandidateController, prisma };
