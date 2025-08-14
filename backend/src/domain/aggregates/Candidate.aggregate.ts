import { CandidateId } from '../value-objects/CandidateId.vo';
import { Email } from '../value-objects/Email.vo';
import { Telefono } from '../value-objects/Telefono.vo';
import { Direccion } from '../value-objects/Direccion.vo';
import { WorkExperience } from '../value-objects/WorkExperience.vo';
import { Education } from '../value-objects/Education.vo';

export class Candidate {
  private readonly id: CandidateId;
  private email: Email;
  private telefono: Telefono;
  private direccion: Direccion;
  private workExperiences: WorkExperience[] = [];
  private education: Education[] = [];
  private cvUrl?: string;

  constructor(
    id: CandidateId,
    email: Email,
    telefono: Telefono,
    direccion: Direccion
  ) {
    this.id = id;
    this.email = email;
    this.telefono = telefono;
    this.direccion = direccion;
  }

  public addWorkExperience(experience: WorkExperience): void {
    if (this.workExperiences.length >= 3) {
      throw new Error('A candidate cannot have more than 3 work experiences.');
    }
    this.workExperiences.push(experience);
  }

  public assignCv(cvUrl: string): void {
    if (!cvUrl || cvUrl.trim().length === 0) {
      throw new Error('CV URL cannot be empty.');
    }
    this.cvUrl = cvUrl;
  }

  public getDetails(): {
    id: string;
    email: string;
    telefono: string;
    direccion: string;
    workExperiences: WorkExperience[];
    education: Education[];
    cvUrl?: string;
  } {
    return {
      id: this.id.value,
      email: this.email.value,
      telefono: this.telefono.value,
      direccion: this.direccion.value,
      workExperiences: this.workExperiences,
      education: this.education,
      cvUrl: this.cvUrl,
    };
  }
}
