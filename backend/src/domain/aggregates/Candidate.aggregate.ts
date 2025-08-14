import { CandidateId } from '../value-objects/CandidateId.vo';
import { Email } from '../value-objects/Email.vo';
import { Phone } from '../value-objects/Phone.vo';
import { Address } from '../value-objects/Address.vo';
import { WorkExperience } from '../value-objects/WorkExperience.vo';
import { Education } from '../value-objects/Education.vo';

export class Candidate {
  private readonly id: CandidateId;
  private email: Email;
  private phone: Phone;
  private address: Address;
  private workExperiences: WorkExperience[] = [];
  private education: Education[] = [];
  private cvUrl?: string;

  constructor(
    id: CandidateId,
    email: Email,
    phone: Phone,
    address: Address
  ) {
    this.id = id;
    this.email = email;
    this.phone = phone;
    this.address = address;
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
    phone: string;
    address: string;
    workExperiences: WorkExperience[];
    education: Education[];
    cvUrl?: string;
  } {
    return {
      id: this.id.value,
      email: this.email.value,
      phone: this.phone.value,
      address: this.address.value,
      workExperiences: this.workExperiences,
      education: this.education,
      cvUrl: this.cvUrl,
    };
  }
}
