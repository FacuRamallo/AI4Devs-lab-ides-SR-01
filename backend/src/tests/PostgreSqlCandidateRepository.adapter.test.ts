import { PostgreSqlCandidateRepository } from '@infrastructure/PostgreSqlCandidateRepository.adapter.js';
import { Candidate } from '@domain/aggregates/Candidate.aggregate.js';
import { Email } from '@domain/value-objects/Email.vo.js';
import { CandidateId } from '@domain/value-objects/CandidateId.vo.js';
import { Phone } from '@domain/value-objects/Phone.vo.js';
import { Address } from '@domain/value-objects/Address.vo.js';

const mockDatabase: any = {
  candidate: {
    findUnique: jest.fn(),
    upsert: jest.fn(),
  },
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
    mockDatabase.candidate.findUnique.mockResolvedValue(candidateData);

    const candidate = await repository.findByEmail(email);

    expect(candidate).toBeInstanceOf(Candidate);
    const details = candidate?.getDetails();
    expect(details?.email).toBe(email.value);
  });

  it('should return null if no matching email exists', async () => {
    const email = new Email('nonexistent@example.com');
    mockDatabase.candidate.findUnique.mockResolvedValue(null);

    const candidate = await repository.findByEmail(email);

    expect(candidate).toBeNull();
    expect(mockDatabase.candidate.findUnique).toHaveBeenCalledWith({ where: { email: email.value } });
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

    expect(mockDatabase.candidate.upsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: candidate.getDetails().id },
      update: expect.objectContaining({
        email: candidate.getDetails().email,
        phone: candidate.getDetails().phone,
      }),
      create: expect.objectContaining({
        id: candidate.getDetails().id,
        email: candidate.getDetails().email,
        phone: candidate.getDetails().phone,
      }),
    }));
  });
});
