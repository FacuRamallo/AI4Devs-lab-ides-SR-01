export class WorkExperience {
  private readonly company: string;
  private readonly role: string;
  private readonly startDate: Date;
  private readonly endDate?: Date;

  constructor(company: string, role: string, startDate: Date, endDate?: Date) {
    if (!company || company.trim().length === 0) {
      throw new Error('Company name cannot be empty');
    }
    if (!role || role.trim().length === 0) {
      throw new Error('Role cannot be empty');
    }
    if (endDate && endDate < startDate) {
      throw new Error('End date cannot be before start date');
    }

    this.company = company;
    this.role = role;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  public get details(): { company: string; role: string; startDate: Date; endDate?: Date } {
    return {
      company: this.company,
      role: this.role,
      startDate: this.startDate,
      endDate: this.endDate,
    };
  }
}
