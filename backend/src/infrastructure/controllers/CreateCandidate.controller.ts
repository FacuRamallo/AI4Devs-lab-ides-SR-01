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
      const { email, firstName, lastName, phone } = req.body;

      await this.createCandidateUseCase.execute({ email, firstName, lastName, phone });

      return res.status(201).json({ message: 'Candidate created successfully' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      return res.status(400).json({ error: errorMessage });
    }
  }
}
