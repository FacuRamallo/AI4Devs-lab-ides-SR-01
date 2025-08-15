export class Address {
  private readonly address: string;

  constructor(address: string) {
    if (!address || address.trim().length === 0) {
      throw new InvalidAddressError('Address cannot be empty');
    }
    this.address = address;
  }

  public get value(): string {
    return this.address;
  }

  public equals(other: Address): boolean {
    return this.address === other.address;
  }
}

export class InvalidAddressError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidAddressError';
  }
}
