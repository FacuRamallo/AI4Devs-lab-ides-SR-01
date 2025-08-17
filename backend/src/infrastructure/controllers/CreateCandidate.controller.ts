import { Request, Response } from 'express';
import { CreateCandidateUseCase } from '@application/CreateCandidate.usecase.js';

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
      const { id, email, firstName, lastName, phone, address, cvUrl } = req.body;

      const candidateId = await this.createCandidateUseCase.execute({
        id,
        email,
        firstName,
        lastName,
        phone,
        address,
        cvUrl,
      });

      return res.status(201).json({ id: candidateId });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      return res.status(400).json({ error: errorMessage });
    }
  }
}
