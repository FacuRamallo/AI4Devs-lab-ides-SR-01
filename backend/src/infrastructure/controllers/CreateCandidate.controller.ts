import { Request, Response } from 'express';
import { CreateCandidateUseCase } from '@application/CreateCandidate.usecase.js';
import { InvalidAddressError } from '@domain/value-objects/Address.vo.js';
import { InvalidCandidateIdError } from '@domain/value-objects/CandidateId.vo.js';
import { InvalidEmailError } from '@domain/value-objects/Email.vo.js';
import { InvalidNameError } from '@domain/value-objects/Name.vo.js';
import { InvalidWorkExperienceError } from '@domain/value-objects/WorkExperience.vo.js';

export class CreateCandidateController {
  private static instance: CreateCandidateController;

  private constructor(private readonly createCandidateUseCase: CreateCandidateUseCase) {}

  static getInstance(createCandidateUseCase: CreateCandidateUseCase): CreateCandidateController {
    if (!CreateCandidateController.instance) {
      CreateCandidateController.instance = new CreateCandidateController(createCandidateUseCase);
    }
    return CreateCandidateController.instance;
  }

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      console.log(`request body: ${JSON.stringify(req.body)}`);
      const { id, email, firstName, lastName, phone, address, cvUrl, workExperiences, education } = req.body;

      const candidateId = await this.createCandidateUseCase.execute({
        id,
        email,
        firstName,
        lastName,
        phone,
        address,
        cvUrl,
        workExperiences,
        education,
      });

      return res.status(201).json({ id: candidateId });
    } catch (error) {
      if (
        error instanceof InvalidAddressError ||
        error instanceof InvalidEmailError ||
        error instanceof InvalidNameError ||
        error instanceof InvalidCandidateIdError ||
        error instanceof InvalidWorkExperienceError ||
        (error instanceof Error && error.message.includes('Validation error'))
      ) {
        return res.status(400).json({ error: error.message });
      }

      console.error('Unexpected error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
