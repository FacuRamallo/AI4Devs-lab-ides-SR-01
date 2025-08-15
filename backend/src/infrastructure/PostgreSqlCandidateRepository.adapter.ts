import { ICandidateRepository } from '../domain/ICandidateRepository.port';
import { Candidate } from '../domain/aggregates/Candidate.aggregate';
import { Email } from '../domain/value-objects/Email.vo';
import { CandidateId } from '../domain/value-objects/CandidateId.vo';
import { Phone } from '../domain/value-objects/Phone.vo';
import { Address } from '../domain/value-objects/Address.vo';

export class PostgreSqlCandidateRepository implements ICandidateRepository {
  constructor(private readonly database: any) {}

  async findByEmail(email: Email): Promise<Candidate | null> {
    const candidateData = await this.database.findOne({ where: { email: email.value } });
    if (!candidateData) {
      return null;
    }

    return Candidate.create({
      id: CandidateId.from(candidateData.id),
      email: new Email(candidateData.email),
      phone: new Phone(candidateData.phone),
      address: new Address(candidateData.address),
    });
  }

  async findById(id: CandidateId): Promise<Candidate | null> {
    const candidateData = await this.database.findOne({ where: { id: id.value } });
    if (!candidateData) {
      return null;
    }

    return Candidate.create({
      id: CandidateId.from(candidateData.id),
      email: new Email(candidateData.email),
      phone: new Phone(candidateData.phone),
      address: new Address(candidateData.address),
    });
  }

  async save(candidate: Candidate): Promise<void> {
    const details = candidate.getDetails();
    await this.database.save({
      id: details.id,
      email: details.email,
      phone: details.phone,
      address: details.address,
    });
  }
}
