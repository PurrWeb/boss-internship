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

export interface StepInfo {
  readonly touched: boolean;
  readonly hasErrors: boolean;
}

export interface StepsInfo {
  readonly 1?: StepInfo;
  readonly 2?: StepInfo;
  readonly 3?: StepInfo;
  readonly 4?: StepInfo;
  readonly 5?: StepInfo;
}

