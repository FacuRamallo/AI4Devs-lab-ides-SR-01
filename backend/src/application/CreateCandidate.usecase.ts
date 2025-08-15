import { ICandidateRepository } from '@domain/ICandidateRepository.port.js';
import { Candidate } from '@domain/aggregates/Candidate.aggregate.js';
import { Email } from '@domain/value-objects/Email.vo.js';
import { Phone } from '@domain/value-objects/Phone.vo.js';
import { CandidateId } from '@domain/value-objects/CandidateId.vo.js';
import { Address } from '@domain/value-objects/Address.vo.js';

interface CreateCandidateDTO {
  email: string;
  name: string;
  phone: string;
}

export class CreateCandidateUseCase {
  constructor(private readonly candidateRepository: ICandidateRepository) {}

  async execute(command: CreateCandidateDTO): Promise<void> {
    const email = new Email(command.email);
    const phone = new Phone(command.phone);

    const existingCandidate = await this.candidateRepository.findByEmail(email);
    if (existingCandidate) {
      throw new Error('A candidate with this email already exists.');
    }

    const newCandidate = Candidate.create({
      id: CandidateId.create(),
      email,
      phone,
      address: new Address('Default Address')
    });

    await this.candidateRepository.save(newCandidate);
  }
}
