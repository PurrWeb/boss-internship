import {ValidatorFn, AsyncValidatorFn, AsyncValidators, Validators, FormValidators} from 'react-redux-form';

export interface AvatarInputValidators extends Validators {
  readonly isFilled: ValidatorFn;
  readonly isProperFormat: ValidatorFn;
  readonly isProperFileSize: ValidatorFn;
}

export interface GenderInputValidators extends Validators {
  readonly isFilled: ValidatorFn;
}

export interface CountryInputValidators extends Validators {
  readonly isFilled: ValidatorFn;
}

export interface IsFilledInputValidator extends Validators {
  readonly isFilled: ValidatorFn;
}

export interface IsAsyncFilledInputValidator extends AsyncValidators {
  readonly isFilled: AsyncValidatorFn;
}

export interface EmailInputValidators extends Validators {
  readonly isFilled: ValidatorFn;
  readonly isEmail: ValidatorFn;
}

export interface MainVenueValidators extends Validators {
  readonly isFilled: ValidatorFn;
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
  readonly isFilled: ValidatorFn;
  readonly isPinCode: ValidatorFn;
}

export interface NationalInsuranceNumberInputValidators extends Validators {
  readonly isNationalInsuranceNumber: ValidatorFn;
}

export interface PayRateInputValidators extends Validators {
  readonly isFilled: ValidatorFn;
}

