import { PostgreSqlCandidateRepository } from '@infrastructure/PostgreSqlCandidateRepository.adapter.js';
import { CreateCandidateUseCase } from '@application/CreateCandidate.usecase.js';
import { CreateCandidateController } from '@infrastructure/controllers/CreateCandidate.controller.js';
import { PrismaClient } from '@prisma/client';
import { S3FileStorageAdapter } from '@infrastructure/S3FileStorage.adapter.js';
import { UploadCvUseCase } from '@application/UploadCv.usecase.js';

const prisma = new PrismaClient();
const candidateRepository = PostgreSqlCandidateRepository.getInstance(prisma);
const createCandidateUseCase = new CreateCandidateUseCase(candidateRepository);
const createCandidateController = CreateCandidateController.getInstance(createCandidateUseCase);
const fileStorage = new S3FileStorageAdapter();
const uploadCvUseCase = new UploadCvUseCase(candidateRepository, fileStorage);

export { prisma, candidateRepository, createCandidateUseCase, createCandidateController, fileStorage, uploadCvUseCase };
