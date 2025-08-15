import { Candidate } from '../domain/aggregates/Candidate.aggregate';
import { CandidateId } from '../domain/value-objects/CandidateId.vo';
import { Email } from '../domain/value-objects/Email.vo';
import { Phone } from '../domain/value-objects/Phone.vo';
import { Address } from '../domain/value-objects/Address.vo';
import { WorkExperience } from '../domain/value-objects/WorkExperience.vo';

describe('Candidate Aggregate', () => {
  it('should add a work experience if less than 3 exist', () => {
    let candidate = new Candidate(
      CandidateId.from('123'),
      new Email('test@example.com'),
      new Phone('+1234567890'),
      new Address('123 Main St')
    );

    const experience = new WorkExperience('Company A', 'Developer', new Date('2020-01-01'));
    candidate = candidate.addWorkExperience(experience);

    expect(candidate.getDetails().workExperiences).toHaveLength(1);
  });

  it('should throw an error if adding more than 3 work experiences', () => {
    let candidate = new Candidate(
      CandidateId.from('123'),
      new Email('test@example.com'),
      new Phone('+1234567890'),
      new Address('123 Main St')
    );

    candidate = candidate
        .addWorkExperience(new WorkExperience('Company A', 'Developer', new Date('2020-01-01')))
        .addWorkExperience(new WorkExperience('Company B', 'Manager', new Date('2021-01-01')))
        .addWorkExperience(new WorkExperience('Company C', 'Tester', new Date('2022-01-01')));

    expect(() => {
      candidate.addWorkExperience(new WorkExperience('Company D', 'Analyst', new Date('2023-01-01')));
    }).toThrow('A candidate cannot have more than 3 work experiences.');
  });

  it('should assign a CV URL', () => {
    let candidate = new Candidate(
      CandidateId.from('123'),
      new Email('test@example.com'),
      new Phone('+1234567890'),
      new Address('123 Main St')
    );

    candidate = candidate.assignCv('http://example.com/cv.pdf');

    expect(candidate.getDetails().cvUrl).toBe('http://example.com/cv.pdf');
  });

  it('should throw an error if CV URL is empty', () => {
    const candidate = new Candidate(
      CandidateId.from('123'),
      new Email('test@example.com'),
      new Phone('+1234567890'),
      new Address('123 Main St')
    );

    expect(() => {
      candidate.assignCv('');
    }).toThrow('CV URL cannot be empty.');
  });
});
