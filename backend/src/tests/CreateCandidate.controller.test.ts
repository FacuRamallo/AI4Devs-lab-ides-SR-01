import { CreateCandidateController } from '@infrastructure/controllers/CreateCandidate.controller.js';
import { CreateCandidateUseCase } from '@application/CreateCandidate.usecase.js';
import { Request, Response } from 'express';

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
    controller = CreateCandidateController.getInstance(mockCreateCandidateUseCase);

    req = {
      body: {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '123456789',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return 201 if the candidate is created successfully', async () => {
    (mockCreateCandidateUseCase.execute as jest.Mock).mockResolvedValue('123');

    req.body = {
      id: undefined,
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '123456789',
      address: '123 Main St',
      cvUrl: 'http://example.com/cv.pdf',
    };

    await controller.handle(req as Request, res as Response);

    expect(mockCreateCandidateUseCase.execute).toHaveBeenCalledWith({
      id: undefined,
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '123456789',
      address: '123 Main St',
      cvUrl: 'http://example.com/cv.pdf',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: '123' });
  });

  it('should return 400 if an error occurs', async () => {
    jest.spyOn(mockCreateCandidateUseCase, 'execute').mockRejectedValue(new Error('Validation error'));

    await controller.handle(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Validation error' });
  });
});
