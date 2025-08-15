import { Request, Response } from 'express';
import { CreateCandidateUseCase } from '../CreateCandidate.usecase';

export class CreateCandidateController {
  constructor(private readonly createCandidateUseCase: CreateCandidateUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { email, name, phone } = req.body;

      // Ejecutar el caso de uso
      await this.createCandidateUseCase.execute({ email, name, phone });

      return res.status(201).json({ message: 'Candidate created successfully' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      return res.status(400).json({ error: errorMessage });
    }
  }
}
