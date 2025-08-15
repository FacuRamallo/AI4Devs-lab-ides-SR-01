import { CreateCandidateController } from '../application/controllers/CreateCandidate.controller';
import { CreateCandidateUseCase } from '../application/CreateCandidate.usecase';
import { Request, Response } from 'express';

// Mock del caso de uso
const mockCreateCandidateUseCase = new CreateCandidateUseCase({
  findByEmail: jest.fn(),
  save: jest.fn(),
  findById: jest.fn(),
});
mockCreateCandidateUseCase.execute = jest.fn();

describe('CreateCandidateController', () => {
  let controller: CreateCandidateController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new CreateCandidateController(mockCreateCandidateUseCase);

    req = {
      body: {
        email: 'test@example.com',
        name: 'John Doe',
        phone: '123456789',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('debería devolver 201 si el candidato se crea correctamente', async () => {
    // Act
    await controller.handle(req as Request, res as Response);

    // Assert
    expect(mockCreateCandidateUseCase.execute).toHaveBeenCalledWith({
      email: 'test@example.com',
      name: 'John Doe',
      phone: '123456789',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Candidate created successfully' });
  });

  it('debería devolver 400 si ocurre un error', async () => {
    // Arrange
    jest.spyOn(mockCreateCandidateUseCase, 'execute').mockRejectedValue(new Error('Validation error'));

    // Act
    await controller.handle(req as Request, res as Response);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Validation error' });
  });
});
