export class Education {
  private readonly institution: string;
  private readonly degree: string;
  private readonly startDate: Date;
  private readonly endDate?: Date;

  constructor(institution: string, degree: string, startDate: Date, endDate?: Date) {
    if (!institution || institution.trim().length === 0) {
      throw new InvalidEducationError('Institution name cannot be empty');
    }
    if (!degree || degree.trim().length === 0) {
      throw new InvalidEducationError('Degree cannot be empty');
    }
    if (endDate && endDate < startDate) {
      throw new InvalidEducationError('End date cannot be before start date');
    }

    this.institution = institution;
    this.degree = degree;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  public get details(): { institution: string; degree: string; startDate: Date; endDate?: Date } {
    return {
      institution: this.institution,
      degree: this.degree,
      startDate: this.startDate,
      endDate: this.endDate,
    };
  }

  public equals(other: Education): boolean {
    return (
      this.institution === other.institution &&
      this.degree === other.degree &&
      this.startDate.getTime() === other.startDate.getTime() &&
      this.endDate?.getTime() === other.endDate?.getTime()
    );
  }
}

export class InvalidEducationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidEducationError';
  }
}
