import {ValidatorFn, Validators, FormValidators} from 'react-redux-form';

export interface AvatarInputValidators extends Validators {
  readonly isFilled: ValidatorFn;
}

export interface GenderInputValidators extends Validators {
  readonly isFilled: ValidatorFn;
}

export interface EmailInputValidators extends Validators {
  readonly isFilled: ValidatorFn;
  readonly isEmail: ValidatorFn;
}

export interface PhoneNumberInputValidators extends Validators {
  readonly isPhoneNumber: ValidatorFn;
}

export interface StarterEmploymentStatusInputValidators extends Validators {
  readonly isFilled: ValidatorFn;
}

export interface StarterEmploymentStatusNumberFormValidators extends FormValidators {
  readonly starterEmploymentStatus: StarterEmploymentStatusInputValidators;
}

export interface PinCodeInputValidators extends Validators {
  readonly isPinCode: ValidatorFn;
}

export interface NationalInsuranceNumberInputValidators extends Validators {
  readonly isNationalInsuranceNumber: ValidatorFn;
}

export interface PayRateInputValidators extends Validators {
  readonly isFilled: ValidatorFn;
}

