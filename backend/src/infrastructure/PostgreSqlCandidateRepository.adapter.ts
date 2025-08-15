import { ICandidateRepository } from '@domain/ICandidateRepository.port.js';
import { Candidate } from '@domain/aggregates/Candidate.aggregate.js';
import { Email } from '@domain/value-objects/Email.vo.js';
import { CandidateId } from '@domain/value-objects/CandidateId.vo.js';
import { Phone } from '@domain/value-objects/Phone.vo.js';
import { Address } from '@domain/value-objects/Address.vo.js';
import { PrismaClient } from '@prisma/client';

export class PostgreSqlCandidateRepository implements ICandidateRepository {
  private static instance: PostgreSqlCandidateRepository;

  private constructor(private readonly database: PrismaClient) {}

  static getInstance(database: PrismaClient): PostgreSqlCandidateRepository {
    if (!PostgreSqlCandidateRepository.instance) {
      PostgreSqlCandidateRepository.instance = new PostgreSqlCandidateRepository(database);
    }
    return PostgreSqlCandidateRepository.instance;
  }

  async findByEmail(email: Email): Promise<Candidate | null> {
    const candidateData = await this.database.candidate.findUnique({ where: { email: email.value } });
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
    const candidateData = await this.database.candidate.findUnique({ where: { id: id.value } });
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
    await this.database.candidate.upsert({
      where: { id: details.id },
      update: {
        email: details.email,
        phone: details.phone,
        address: details.address,
      },
      create: {
        id: details.id,
        email: details.email,
        phone: details.phone,
        address: details.address,
      },
    });
  }
}
