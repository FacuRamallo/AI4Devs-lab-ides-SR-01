import { Candidate } from './aggregates/Candidate.aggregate.js';
import { Email } from './value-objects/Email.vo.js';
import { CandidateId } from './value-objects/CandidateId.vo.js';

export interface ICandidateRepository {
  findByEmail(email: Email): Promise<Candidate | null>;
  save(candidate: Candidate): Promise<void>;
  findById(id: CandidateId): Promise<Candidate | null>;
}
