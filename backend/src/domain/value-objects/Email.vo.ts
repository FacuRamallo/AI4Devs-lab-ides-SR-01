export class Email {
  private readonly email: string;

  constructor(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new InvalidEmailError('Invalid email format');
    }
    this.email = email;
  }

  public get value(): string {
    return this.email;
  }

  public equals(other: Email): boolean {
    return this.email === other.email;
  }
}

export class InvalidEmailError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidEmailError';
  }
}
