export class Name {
    private readonly name: string;

    constructor(name: string) {
        if (!name || !/^[a-zA-Z]+$/.test(name)) {
            throw new InvalidNameError('Name must only contain letters and cannot be null.');
        }
        this.name = name;
    }
    
    public get value(): string {
        return this.name;
    }

    equals(other: Name): boolean {
        return this.name === other.name;
    }
}

export class InvalidNameError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidNameError';
  }
}