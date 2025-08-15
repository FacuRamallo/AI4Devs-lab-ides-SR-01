import { Candidate } from './aggregates/Candidate.aggregate';
import { Email } from './value-objects/Email.vo';
import { CandidateId } from './value-objects/CandidateId.vo';

export interface ICandidateRepository {
  findByEmail(email: Email): Promise<Candidate | null>;
  save(candidate: Candidate): Promise<void>;
  findById(id: CandidateId): Promise<Candidate | null>;
}
