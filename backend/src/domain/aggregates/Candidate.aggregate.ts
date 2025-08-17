import { CandidateId } from '../value-objects/CandidateId.vo.js';
import { Email } from '../value-objects/Email.vo.js';
import { Phone } from '../value-objects/Phone.vo.js';
import { Address } from '../value-objects/Address.vo.js';
import { WorkExperience } from '../value-objects/WorkExperience.vo.js';
import { Education } from '../value-objects/Education.vo.js';
import { Name } from '../value-objects/Name.vo.js';

export class Candidate {
  private readonly id: CandidateId;
  private readonly email: Email;
  private readonly phone: Phone;
  private readonly firstName: Name;
  private readonly lastName: Name;
  private readonly address: Address;
  private readonly workExperiences: WorkExperience[] = [];
  private readonly education: Education[] = [];
  private readonly cvUrl?: string;

  constructor(
    id: CandidateId,
    email: Email,
    phone: Phone,
    firstName: Name,
    lastName: Name,
    address: Address,
    workExperiences: WorkExperience[] = [],
    education: Education[] = [],
    cvUrl?: string
  ) {
    this.id = id;
    this.email = email;
    this.phone = phone;
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.workExperiences = workExperiences;
    this.education = education;
    this.cvUrl = cvUrl;
  }

  public static create(params: {
    id: CandidateId;
    email: Email;
    phone: Phone;
    firstName: Name;
    lastName: Name;
    address: Address;
    workExperiences?: WorkExperience[];
    education?: Education[];
    cvUrl?: string;
  }): Candidate {
    return new Candidate(
      params.id,
      params.email,
      params.phone,
      params.firstName,
      params.lastName,
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
      this.firstName,
      this.lastName,
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
      this.firstName,
      this.lastName,
      this.address,
      this.workExperiences,
      this.education,
      cvUrl
    );
  }

  public updateDetails(details: {
    email: Email;
    phone: Phone;
    address: Address;
    firstName: Name;
    lastName: Name;
    cvUrl?: string;
  }): Candidate {
    return new Candidate(
      this.id,
      details.email,
      details.phone,
      details.firstName,
      details.lastName,
      details.address,
      this.workExperiences,
      this.education,
      details.cvUrl
    );
  }

  public getDetails(): {
    id: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    address: string;
    workExperiences: WorkExperience[];
    education: Education[];
    cvUrl?: string;
  } {
    return {
      id: this.id.value,
      email: this.email.value,
      phone: this.phone.value,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
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
