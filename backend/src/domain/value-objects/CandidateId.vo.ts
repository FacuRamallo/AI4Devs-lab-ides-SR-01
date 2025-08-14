export class CandidateId {
  private readonly id: string;

  constructor(id: string) {
    if (!id || id.trim().length === 0) {
      throw new Error('CandidateId cannot be empty');
    }
    this.id = id;
  }

  public get value(): string {
    return this.id;
  }
}
