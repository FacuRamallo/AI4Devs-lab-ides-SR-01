import { ICandidateRepository } from '../domain/ICandidateRepository.port';
import { Candidate } from '../domain/aggregates/Candidate.aggregate';
import { Email } from '../domain/value-objects/Email.vo';
import { Phone } from '../domain/value-objects/Phone.vo';
import { CandidateId } from '../domain/value-objects/CandidateId.vo';
import { Address } from '../domain/value-objects/Address.vo';
import { v4 as uuidv4 } from 'uuid';

interface CreateCandidateDTO {
  email: string;
  name: string;
  phone: string;
}

export class CreateCandidateUseCase {
  constructor(private readonly candidateRepository: ICandidateRepository) {}

  async execute(command: CreateCandidateDTO): Promise<void> {
    const email = new Email(command.email);
    const phone = new Phone(command.phone); // Crear instancia de Phone

    // Verificar si ya existe un candidato con el mismo email
    const existingCandidate = await this.candidateRepository.findByEmail(email);
    if (existingCandidate) {
      throw new Error('A candidate with this email already exists.');
    }

    // Crear el agregado Candidate
    const newCandidate = Candidate.create({
      id: CandidateId.create(), // Generar un UUID para CandidateId
      email,
      phone,
      address: new Address('Default Address'), // Crear una Address por defecto o basada en el comando
    });

    // Guardar el agregado
    await this.candidateRepository.save(newCandidate);
  }
}
