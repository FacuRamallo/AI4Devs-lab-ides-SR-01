export class Direccion {
  private readonly direccion: string;

  constructor(direccion: string) {
    if (!direccion || direccion.trim().length === 0) {
      throw new Error('Direccion cannot be empty');
    }
    this.direccion = direccion;
  }

  public get value(): string {
    return this.direccion;
  }
}
