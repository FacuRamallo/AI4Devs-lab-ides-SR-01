export class Education {
  private readonly institution: string;
  private readonly degree: string;
  private readonly startDate: Date;
  private readonly endDate?: Date;

  constructor(institution: string, degree: string, startDate: Date, endDate?: Date) {
    if (!institution || institution.trim().length === 0) {
      throw new Error('Institution name cannot be empty');
    }
    if (!degree || degree.trim().length === 0) {
      throw new Error('Degree cannot be empty');
    }
    if (endDate && endDate < startDate) {
      throw new Error('End date cannot be before start date');
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
}
