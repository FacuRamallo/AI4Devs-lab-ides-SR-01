import { CreateCandidateUseCase } from '@application/CreateCandidate.usecase.js';
import { ICandidateRepository } from '@domain/ICandidateRepository.port.js';
import { Candidate } from '@domain/aggregates/Candidate.aggregate.js';
import { Email } from '@domain/value-objects/Email.vo.js';
import { Name } from '@domain/value-objects/Name.vo.js';

const mockCandidateRepository: jest.Mocked<ICandidateRepository> = {
  findByEmail: jest.fn(),
  save: jest.fn(),
  findById: jest.fn(),
};

describe('CreateCandidateUseCase', () => {
  let createCandidateUseCase: CreateCandidateUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    createCandidateUseCase = new CreateCandidateUseCase(mockCandidateRepository);
  });

  it('should throw an error if a candidate with the same email already exists', async () => {
    const existingEmail = new Email('test@example.com');
    mockCandidateRepository.findByEmail.mockResolvedValue(
      Candidate.create({
        id: expect.anything(),
        email: existingEmail,
        phone: expect.anything(),
        firstName: new Name('John'),
        lastName: new Name('Doe'),
        address: expect.anything(),
      })
    );

    const command = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '123456789',
    };

    await expect(createCandidateUseCase.execute(command)).rejects.toThrow(
      'A candidate with this email already exists.'
    );
    expect(mockCandidateRepository.findByEmail).toHaveBeenCalledWith(existingEmail);
  });

  it('should correctly create value objects and save the candidate', async () => {
    const newEmail = new Email('new@example.com');
    mockCandidateRepository.findByEmail.mockResolvedValue(null);

    const command = {
      email: 'new@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
      phone: '987654321',
    };

    await createCandidateUseCase.execute(command);

    expect(mockCandidateRepository.findByEmail).toHaveBeenCalledWith(newEmail);
    expect(mockCandidateRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: expect.any(Name),
        lastName: expect.any(Name),
      })
    );
  });
});
