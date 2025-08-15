import { PostgreSqlCandidateRepository } from '../infrastructure/PostgreSqlCandidateRepository.adapter';
import { Candidate } from '../domain/aggregates/Candidate.aggregate';
import { Email } from '../domain/value-objects/Email.vo';
import { CandidateId } from '../domain/value-objects/CandidateId.vo';
import { Phone } from '../domain/value-objects/Phone.vo';
import { Address } from '../domain/value-objects/Address.vo';

const mockDatabase: any = {
  findOne: jest.fn(),
  save: jest.fn(),
};

describe('PostgreSqlCandidateRepository', () => {
  let repository: PostgreSqlCandidateRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = PostgreSqlCandidateRepository.getInstance(mockDatabase);
  });

  it('should return a candidate if a matching email exists', async () => {
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

    const candidate = await repository.findByEmail(email);

    expect(candidate).toBeInstanceOf(Candidate);
    const details = candidate?.getDetails();
    expect(details?.email).toBe(email.value);
  });

  it('should return null if no matching email exists', async () => {
    const email = new Email('nonexistent@example.com');
    mockDatabase.findOne.mockResolvedValue(null);

    const candidate = await repository.findByEmail(email);

    expect(candidate).toBeNull();
    expect(mockDatabase.findOne).toHaveBeenCalledWith({ where: { email: email.value } });
  });

  it('should save a candidate correctly', async () => {
    const phone = new Phone('123456789');
    const address = new Address('Test Address');
    const candidate = Candidate.create({
      id: CandidateId.create(),
      email: new Email('save@example.com'),
      phone: phone,
      address: address,
    });

    await repository.save(candidate);

    expect(mockDatabase.save).toHaveBeenCalledWith(expect.objectContaining({
      id: candidate.getDetails().id,
      email: candidate.getDetails().email,
    }));
  });
});
