/// <reference path="../custom-typings/react-redux-form.d.ts" />
/// <reference path="../../../node_modules/@types/validator/index.d.ts" />

import {Store} from 'redux';
import {Epic} from 'redux-observable';
import {Observable} from 'rxjs';
import {actions} from 'react-redux-form';

import {VALIDATING_ALL_ADD_STAFF_MEMBER_STEP_FORMS} from '../constants/action-names';
import {SimpleAction} from '../interfaces/actions';
import {StoreStructure} from '../interfaces/store-models';
import {isNotEmptyInput, isMobilePhoneSimpleCheck, isNationalInsuranceNumber} from '../helpers/index';
import {OfType} from '../interfaces/index';
import {
  GenderInputValidators, EmailInputValidators, PhoneNumberInputValidators,
  NationalInsuranceNumberInputValidators, StarterEmploymentStatusInputValidators, PayRateInputValidators
} from '../interfaces/forms';
import * as isEmail from 'validator/lib/isEmail';

const validateAllAddStaffMemberStepForms = ((action$, store: Store<StoreStructure>) => {
  return action$.ofType(VALIDATING_ALL_ADD_STAFF_MEMBER_STEP_FORMS)
    .mergeMap(() => {
      const {basicInformationForm, contactDetailsForm, workForm} =
        store.getState().formsData.forms;

      const validateBasicInformationFormGenderAction = actions.setValidity('formsData.basicInformationForm.gender', {
        isFilled: isNotEmptyInput(basicInformationForm.gender.value),
      } as OfType<GenderInputValidators, boolean>);

      const validateContactDetailsFormEmailAction = actions.setValidity('formsData.contactDetailsForm.email', {
        isFilled: isNotEmptyInput(contactDetailsForm.email.value),
        isEmail: (() => {
          return contactDetailsForm.email.value ? isEmail(contactDetailsForm.email.value) : true;
        })(),
      } as OfType<EmailInputValidators, boolean>);

      const validateContactDetailsFormPhoneNumberAction = actions.setValidity('formsData.contactDetailsForm.phoneNumber', {
        isPhoneNumber: !contactDetailsForm.phoneNumber.value ||
          isMobilePhoneSimpleCheck(contactDetailsForm.phoneNumber.value)
      } as OfType<PhoneNumberInputValidators, boolean>);

      const validateWorkFormNationalInsuranceNumberAction = actions.setValidity('formsData.workForm.nationalInsuranceNumber', {
        isNationalInsuranceNumber: !workForm.nationalInsuranceNumber.value ||
          isNationalInsuranceNumber(workForm.nationalInsuranceNumber.value),
      } as OfType<NationalInsuranceNumberInputValidators, boolean>);

      const validateWorkFormStarterEmploymentStatusAction = actions.setValidity('formsData.workForm.starterEmploymentStatus', {
        isFilled: isNotEmptyInput(workForm.starterEmploymentStatus.value),
      } as OfType<StarterEmploymentStatusInputValidators, boolean>);

      const validateWorkFormPayRateAction = actions.setValidity('formsData.workForm.payRate', {
        isFilled: isNotEmptyInput(workForm.payRate.value),
      } as OfType<PayRateInputValidators, boolean>);

      return Observable.of<SimpleAction>(
        validateBasicInformationFormGenderAction,
        validateContactDetailsFormEmailAction,
        validateContactDetailsFormPhoneNumberAction,
        validateWorkFormNationalInsuranceNumberAction,
        validateWorkFormStarterEmploymentStatusAction,
        validateWorkFormPayRateAction
      );
  });
}) as Epic<SimpleAction, StoreStructure>;

export default validateAllAddStaffMemberStepForms;
