import { Request, Response } from 'express';
import { CreateCandidateUseCase } from '../../application/CreateCandidate.usecase';

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
      const { email, name, phone } = req.body;

      await this.createCandidateUseCase.execute({ email, name, phone });

      return res.status(201).json({ message: 'Candidate created successfully' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      return res.status(400).json({ error: errorMessage });
    }
  }
}
