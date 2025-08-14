export class Phone {
  private readonly numero: string;

  constructor(numero: string) {
    const telefonoRegex = /^\+?[1-9]\d{1,14}$/;
    if (!telefonoRegex.test(numero)) {
      throw new Error('Invalid phone number format');
    }
    this.numero = numero;
  }

  public get value(): string {
    return this.numero;
  }
}
