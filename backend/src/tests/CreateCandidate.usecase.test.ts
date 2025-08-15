import { CreateCandidateUseCase } from '../application/CreateCandidate.usecase';
import { ICandidateRepository } from '../domain/ICandidateRepository.port';
import { Candidate } from '../domain/aggregates/Candidate.aggregate';
import { Email } from '../domain/value-objects/Email.vo';

// Mock del repositorio
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

  it('debería lanzar un error si ya existe un candidato con el mismo email', async () => {
    // Arrange
    const existingEmail = new Email('test@example.com');
    mockCandidateRepository.findByEmail.mockResolvedValue(
      Candidate.create({
        id: expect.anything(), // Mocked CandidateId
        email: existingEmail,
        phone: expect.anything(), // Mocked Phone
        address: expect.anything(), // Mocked Address
      })
    );

    const command = {
      email: 'test@example.com',
      name: 'John Doe',
      phone: '123456789',
    };

    // Act & Assert
    await expect(createCandidateUseCase.execute(command)).rejects.toThrow(
      'A candidate with this email already exists.'
    );
    expect(mockCandidateRepository.findByEmail).toHaveBeenCalledWith(existingEmail);
  });

  it('debería crear correctamente los objetos de valor y guardar el candidato', async () => {
    // Arrange
    const newEmail = new Email('new@example.com');
    mockCandidateRepository.findByEmail.mockResolvedValue(null);

    const command = {
      email: 'new@example.com',
      name: 'Jane Doe',
      phone: '987654321',
    };

    // Act
    await createCandidateUseCase.execute(command);

    // Assert
    expect(mockCandidateRepository.findByEmail).toHaveBeenCalledWith(newEmail);
    expect(mockCandidateRepository.save).toHaveBeenCalled();
  });
});
