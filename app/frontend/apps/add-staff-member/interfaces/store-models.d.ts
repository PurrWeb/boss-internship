import {Structure as ReducersStructure} from '../reducers/index';

export type StoreStructure = ReducersStructure;

export type Gender = 'male' | 'female';

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
  readonly mainVenue: string;
  readonly otherVenues?: string;
  readonly startsAt: string;
}

export interface WorkFormFields {
  readonly staffType: string;
  readonly siaBadgeNumber: string;
  readonly siaBadgeExpiryDate: string;
  readonly pinCode: string;
  readonly nationalInsuranceNumber?: string;
  readonly dayPreference?: string;
  readonly hoursPreference?: string;
  readonly payRate: string;
  readonly starterEmploymentStatus?: string;
}

export interface GlobalError {
  readonly message: string;
  readonly date: number;
}

