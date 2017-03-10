import {StarterEmploymentStatus} from '../interfaces/store-models';

export enum AddStaffMemberSteps {
  BasicInformationBlock,
  AddAvatarBlock,
  VenuesBlock,
  ContactDetailsBlock,
  WorkBlock,
  PreviewBlock
}

export const starterEmploymentStatusLabels: {[key in StarterEmploymentStatus]: string } = {
  employment_status_p45_supplied: 'I have supplied my P45 from my previous employer',
  employment_status_a: `This is my first job since the 6th of April. I have not been receiving taxable Jobseeker's Allowance, Incapacity Benefit or a state/occupational pernsion.`,
  employment_status_b: `This is now my only job. Since the 6th of April I have had another job, received taxable Jobseeker's Allowance or Incapacity Benefit. I do not receive a state/occupational pension.`,
  employment_status_c: `I have another job or receive a state/occupational pernsion.`,
  employment_status_d: `I left a course of higher education before the 6th of April & received my first student loan instalment on or after the 1st of September 1998 & I have not fully repaid my student loan.`
};
