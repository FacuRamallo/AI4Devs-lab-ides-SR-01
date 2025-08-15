export class CandidateId {
  private readonly id: string;

  constructor(id: string) {
    if (!id || id.trim().length === 0) {
      throw new InvalidCandidateIdError('CandidateId cannot be empty');
    }
    this.id = id;
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
