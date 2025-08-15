import { UploadCvUseCase } from '@application/UploadCv.usecase.js';
import { S3FileStorageAdapter } from '@infrastructure/S3FileStorage.adapter.js';
import { Candidate } from '@domain/aggregates/Candidate.aggregate.js';
import { CandidateId } from '@domain/value-objects/CandidateId.vo.js';
import { ICandidateRepository } from '@domain/ICandidateRepository.port.js';
import { Email } from '@domain/value-objects/Email.vo.js';
import { Phone } from '@domain/value-objects/Phone.vo.js';
import { Address } from '@domain/value-objects/Address.vo.js';

// Mock repository
class MockCandidateRepository implements ICandidateRepository {
  private candidates: Map<string, Candidate> = new Map();

  async save(candidate: Candidate): Promise<void> {
    this.candidates.set(candidate.getDetails().id, candidate);
  }

  async findById(id: CandidateId): Promise<Candidate | null> {
    return this.candidates.get(id.value) || null;
  }

  async findByEmail(): Promise<Candidate | null> {
    return null;
  }
}

describe('UploadCvUseCase Integration Test', () => {
  const candidateRepository = new MockCandidateRepository();
  const fileStorage = new S3FileStorageAdapter();
  const uploadCvUseCase = new UploadCvUseCase(candidateRepository, fileStorage);

  it('should upload a CV and update the candidate aggregate', async () => {
    // Arrange
    const candidateId = CandidateId.from('test-candidate-id');
    const candidate = Candidate.create({
      id: candidateId,
      email: new Email('test@example.com'),
      phone: new Phone('1234567890'),
      address: new Address('123 Test St'),
    });
    await candidateRepository.save(candidate);

    const fileBuffer = Buffer.from('test file content');

    // Act
    await uploadCvUseCase.execute(candidateId, fileBuffer);

    // Assert
    const updatedCandidate = await candidateRepository.findById(candidateId);
    expect(updatedCandidate).not.toBeNull();
    expect(updatedCandidate?.getDetails().cvUrl).toContain('ltis3storage');
  });
});
