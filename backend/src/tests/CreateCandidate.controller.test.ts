import { CreateCandidateController } from '@infrastructure/controllers/CreateCandidate.controller.js';
import { CreateCandidateUseCase } from '@application/CreateCandidate.usecase.js';
import { Request, Response } from 'express';
import { InvalidEmailError } from '@domain/value-objects/Email.vo.js';
import { InvalidAddressError } from '@domain/value-objects/Address.vo.js';
import { InvalidNameError } from '@domain/value-objects/Name.vo.js';
import { InvalidCandidateIdError } from '@domain/value-objects/CandidateId.vo.js';
import { InvalidWorkExperienceError } from '@domain/value-objects/WorkExperience.vo.js';

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

  it('should handle workExperiences and education in the request body', async () => {
    (mockCreateCandidateUseCase.execute as jest.Mock).mockResolvedValue('123');

    req.body = {
      id: undefined,
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '123456789',
      address: '123 Main St',
      cvUrl: 'http://example.com/cv.pdf',
      workExperiences: [
        {
          company: 'Company A',
          role: 'Developer',
          startDate: '2020-01-01',
          endDate: '2021-01-01',
        },
      ],
      education: [
        {
          institution: 'University A',
          degree: 'Bachelor of Science',
          startDate: '2015-01-01',
          endDate: '2019-01-01',
        },
      ],
    };

    await controller.handle(req as Request, res as Response);

    expect(mockCreateCandidateUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        workExperiences: expect.arrayContaining([
          expect.objectContaining({
            company: 'Company A',
            role: 'Developer',
          }),
        ]),
        education: expect.arrayContaining([
          expect.objectContaining({
            institution: 'University A',
            degree: 'Bachelor of Science',
          }),
        ]),
      })
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: '123' });
  });

  it('should return 400 for domain-specific exceptions', async () => {
    jest.spyOn(mockCreateCandidateUseCase, 'execute').mockRejectedValue(new InvalidEmailError('Invalid email format'));

    await controller.handle(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email format' });
  });

  it('should return 500 for unexpected errors', async () => {
    jest.spyOn(mockCreateCandidateUseCase, 'execute').mockRejectedValue(new Error('Unexpected error'));

    await controller.handle(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
