import { ICandidateRepository } from '@domain/ICandidateRepository.port.js';
import { IFileStorage } from '@domain/IFileStorage.port.js';
import { CandidateId } from '@domain/value-objects/CandidateId.vo.js';

export class UploadCvUseCase {
  constructor(
    private readonly candidateRepository: ICandidateRepository,
    private readonly fileStorage: IFileStorage
  ) {}

  public async execute(candidateId: CandidateId, fileBuffer: Buffer): Promise<string> {
    const cvUrl = await this.fileStorage.upload(fileBuffer, `candidates/${candidateId.value}/cv`);

    const candidate = await this.candidateRepository.findById(candidateId);
    if (!candidate) {
      throw new Error(`Candidate with ID ${candidateId.value} not found.`);
    }

    const updatedCandidate = candidate.assignCv(cvUrl);

    await this.candidateRepository.save(updatedCandidate);
    return cvUrl;
  }
}
