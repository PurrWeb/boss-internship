import {Structure as ReducersStructure} from '../reducers';

export type StoreStructure = ReducersStructure;

export type Gender = 'male' | 'female';
type StarterEmploymentStatus = 'employment_status_p45_supplied' | 'employment_status_a' | 'employment_status_b' | 'employment_status_c' | 'employment_status_d';

export interface BasicInformationFormFields {
  readonly firstName?: string;
  readonly surname?: string;
  readonly gender: Gender;
  readonly dateOfBirth?: string;
}

export interface UploadPhotoFormFields {
  readonly avatar: string;
}

export interface ContactDetailsFormFields {
  readonly email: string;
  readonly address?: string;
  readonly country?: string;
  readonly county?: string;
  readonly postCode?: string;
  readonly phoneNumber?: string;
}

export interface VenueFormFields {
  readonly mainVenue: number;
  readonly otherVenues?: number[];
  readonly startsAt: string;
}

export interface WorkFormFields {
  readonly staffType: number;
  readonly siaBadgeNumber: string;
  readonly siaBadgeExpiryDate: string;
  readonly pinCode: string;
  readonly nationalInsuranceNumber?: string;
  readonly dayPreference?: string;
  readonly hoursPreference?: string;
  readonly payRate: number;
  readonly starterEmploymentStatus: StarterEmploymentStatus;
}

export interface GlobalError {
  readonly message: string;
  readonly date: number;
}

export interface AddStaffMemberStepInfo {
  readonly hasUnfilledRequired: boolean;
  readonly hasValidationErrors: boolean;
}

export interface AddStaffMemberStepsInfo {
  readonly 0: AddStaffMemberStepInfo;
  readonly 1: AddStaffMemberStepInfo;
  readonly 2: AddStaffMemberStepInfo;
  readonly 3: AddStaffMemberStepInfo;
  readonly 4: AddStaffMemberStepInfo;
}

export type AddStaffMemberStepName = 'BasicInformationBlock' | 'AddAvatarBlock' | 'VenuesBlock' | 'ContactDetailsBlock' | 'WorkBlock' | 'PreviewBlock';

export type AddStaffMemberSteps = Record<AddStaffMemberStepName, number>;


