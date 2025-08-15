import { CandidateId } from '../value-objects/CandidateId.vo';
import { Email } from '../value-objects/Email.vo';
import { Phone } from '../value-objects/Phone.vo';
import { Address } from '../value-objects/Address.vo';
import { WorkExperience } from '../value-objects/WorkExperience.vo';
import { Education } from '../value-objects/Education.vo';

export class Candidate {
  private readonly id: CandidateId;
  private readonly email: Email;
  private readonly phone: Phone;
  private readonly address: Address;
  private readonly workExperiences: WorkExperience[] = [];
  private readonly education: Education[] = [];
  private readonly cvUrl?: string;

  constructor(
    id: CandidateId,
    email: Email,
    phone: Phone,
    address: Address,
    workExperiences: WorkExperience[] = [],
    education: Education[] = [],
    cvUrl?: string
  ) {
    this.id = id;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.workExperiences = workExperiences;
    this.education = education;
    this.cvUrl = cvUrl;
  }

  public static create(params: {
    id: CandidateId;
    email: Email;
    phone: Phone;
    address: Address;
    workExperiences?: WorkExperience[];
    education?: Education[];
    cvUrl?: string;
  }): Candidate {
    return new Candidate(
      params.id,
      params.email,
      params.phone,
      params.address,
      params.workExperiences || [],
      params.education || [],
      params.cvUrl
    );
  }

  public addWorkExperience(experience: WorkExperience): Candidate {
    if (this.workExperiences.length >= 3) {
      throw new MaxWorkExperienceError('A candidate cannot have more than 3 work experiences.');
    }
    return new Candidate(
      this.id,
      this.email,
      this.phone,
      this.address,
      [...this.workExperiences, experience],
      this.education,
      this.cvUrl
    );
  }

  public assignCv(cvUrl: string): Candidate {
    if (!cvUrl || cvUrl.trim().length === 0) {
      throw new InvalidCvUrlError('CV URL cannot be empty.');
    }
    return new Candidate(
      this.id,
      this.email,
      this.phone,
      this.address,
      this.workExperiences,
      this.education,
      cvUrl
    );
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

export class MaxWorkExperienceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MaxWorkExperienceError';
  }
}

export class InvalidCvUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidCvUrlError';
  }
}
