/// <reference path="../custom-typings/react-redux-form.d.ts" />
/// <reference path="../../../node_modules/@types/validator/index.d.ts" />

import {actions} from 'react-redux-form';

import store from '../store/index';
import {
  GenderInputValidators, EmailInputValidators, PayRateInputValidators,
  StarterEmploymentStatusInputValidators, PhoneNumberInputValidators, NationalInsuranceNumberInputValidators
} from '../interfaces/forms';
import {OfType} from '../interfaces/index';
import {isNotEmpty, isNationalInsuranceNumber, isMobilePhoneSimpleCheck} from './index';
import * as isEmail from 'validator/lib/isEmail';

export const validateAllAddStaffMemberStepForms = () => {
  const {basicInformationForm, contactDetailsForm, workForm} =
    store.getState().formsData.forms;

  store.dispatch(actions.setValidity('formsData.basicInformationForm.gender', {
    isFilled: isNotEmpty(basicInformationForm.gender.value),
  } as OfType<GenderInputValidators, boolean>));

  store.dispatch(actions.setValidity('formsData.contactDetailsForm.email', {
    isFilled: isNotEmpty(contactDetailsForm.email.value),
    isEmail: (() => {
      return contactDetailsForm.email.value ? isEmail(contactDetailsForm.email.value) : true;
    })(),
  } as OfType<EmailInputValidators, boolean>));

  store.dispatch(actions.setValidity('formsData.contactDetailsForm.phoneNumber', {
    isPhoneNumber: !contactDetailsForm.phoneNumber.value ||
      isMobilePhoneSimpleCheck(contactDetailsForm.phoneNumber.value)
  } as OfType<PhoneNumberInputValidators, boolean>));

  store.dispatch(actions.setValidity('formsData.workForm.nationalInsuranceNumber', {
    isNationalInsuranceNumber: !workForm.nationalInsuranceNumber.value ||
      isNationalInsuranceNumber(workForm.nationalInsuranceNumber.value),
  } as OfType<NationalInsuranceNumberInputValidators, boolean>));

  store.dispatch(actions.setValidity('formsData.workForm.starterEmploymentStatus', {
    isFilled: isNotEmpty(workForm.starterEmploymentStatus.value),
  } as OfType<StarterEmploymentStatusInputValidators, boolean>));

  store.dispatch(actions.setValidity('formsData.workForm.payRate', {
    isFilled: isNotEmpty(workForm.payRate.value),
  } as OfType<PayRateInputValidators, boolean>));
};
