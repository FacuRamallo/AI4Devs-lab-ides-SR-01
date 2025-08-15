import { PostgreSqlCandidateRepository } from '../infrastructure/PostgreSqlCandidateRepository.adapter';
import { Candidate } from '../domain/aggregates/Candidate.aggregate';
import { Email } from '../domain/value-objects/Email.vo';
import { CandidateId } from '../domain/value-objects/CandidateId.vo';
import { Phone } from '../domain/value-objects/Phone.vo';
import { Address } from '../domain/value-objects/Address.vo';

// Mock del ORM o base de datos
const mockDatabase: any = {
  findOne: jest.fn(),
  save: jest.fn(),
};

describe('PostgreSqlCandidateRepository', () => {
  let repository: PostgreSqlCandidateRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PostgreSqlCandidateRepository(mockDatabase);
  });

  it('debería devolver un candidato si existe un email coincidente', async () => {
    // Arrange
    const email = new Email('test@example.com');
    const phone = new Phone('123456789');
    const address = new Address('Test Address');
    const candidateData = {
      id: '123',
      email: email.value,
      phone: phone.value,
      address: address.value
    };
    mockDatabase.findOne.mockResolvedValue(candidateData);

    // Act
    const candidate = await repository.findByEmail(email);

    // Assert
    expect(candidate).toBeInstanceOf(Candidate);
    // Usar getDetails() para acceder a las propiedades del candidato
    const details = candidate?.getDetails();
    expect(details?.email).toBe(email.value);

    // Reemplazar los mocks con instancias válidas
    mockDatabase.findOne.mockResolvedValue({
      id: '123',
      email: email.value,
      phone: phone, // Pasar la instancia completa de Phone
      address: address, // Pasar la instancia completa de Address
    });
  });

  it('debería devolver null si no existe un email coincidente', async () => {
    // Arrange
    const email = new Email('nonexistent@example.com');
    mockDatabase.findOne.mockResolvedValue(null);

    // Act
    const candidate = await repository.findByEmail(email);

    // Assert
    expect(candidate).toBeNull();
    expect(mockDatabase.findOne).toHaveBeenCalledWith({ where: { email: email.value } });
  });

  it('debería guardar un candidato correctamente', async () => {
    // Arrange
    const phone = new Phone('123456789');
    const address = new Address('Test Address');
    const candidate = Candidate.create({
      id: CandidateId.create(),
      email: new Email('save@example.com'),
      phone: phone,
      address: address,
    });

    // Act
    await repository.save(candidate);

    // Assert
    expect(mockDatabase.save).toHaveBeenCalledWith(expect.objectContaining({
      id: candidate.getDetails().id,
      email: candidate.getDetails().email,
    }));
  });
});
