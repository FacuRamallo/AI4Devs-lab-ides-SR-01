import { ICandidateRepository } from '@domain/ICandidateRepository.port.js';
import { Candidate } from '@domain/aggregates/Candidate.aggregate.js';
import { Email } from '@domain/value-objects/Email.vo.js';
import { Phone } from '@domain/value-objects/Phone.vo.js';
import { CandidateId } from '@domain/value-objects/CandidateId.vo.js';
import { Address } from '@domain/value-objects/Address.vo.js';
import { Name } from '@domain/value-objects/Name.vo.js';

interface CreateCandidateDTO {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  cvUrl?: string;
}

export class CreateCandidateUseCase {
  constructor(private readonly candidateRepository: ICandidateRepository) {}

  async execute(command: CreateCandidateDTO): Promise<string> {
    const email = new Email(command.email);
    const phone = new Phone(command.phone);
    const address = new Address(command.address);
    const firstName = new Name(command.firstName);
    const lastName = new Name(command.lastName);
    const cvUrl = command.cvUrl;

    let candidate = command.id
      ? await this.candidateRepository.findById(CandidateId.from(command.id))
      : await this.candidateRepository.findByEmail(email);

    if (candidate && !command.id) {
      throw new Error('A candidate with this email already exists.');
    }

    if (candidate) {
      candidate = candidate.updateDetails({
        email,
        phone,
        address,
        firstName,
        lastName,
        cvUrl,
      });
    } else {
      candidate = Candidate.create({
        id: command.id ? CandidateId.from(command.id) : CandidateId.create(),
        email,
        phone,
        address,
        firstName,
        lastName,
        cvUrl,
      });
    }

    await this.candidateRepository.save(candidate);
    return candidate.getDetails().id;
  }
}
