import { v4 as uuidv4 } from 'uuid';

export class CandidateId {
  private readonly id: string;

  private constructor(id: string) {
    if (!id || id.trim().length === 0) {
      throw new InvalidCandidateIdError('CandidateId cannot be empty');
    }
    this.id = id;
  }

  public static create(): CandidateId {
    return new CandidateId(uuidv4());
  }

  public static from(id: string): CandidateId {
    return new CandidateId(id);
  }

  public get value(): string {
    return this.id;
  }

  public equals(other: CandidateId): boolean {
    return this.id === other.id;
  }
}

export class InvalidCandidateIdError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidCandidateIdError';
  }
}
