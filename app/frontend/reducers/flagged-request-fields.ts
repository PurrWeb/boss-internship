import {ActionWithPayload} from '../interfaces/actions';
import {FILL_FLAGGED_REQUEST_FIELDS} from '../constants/action-names';
import {FlaggedRequestFields} from '../interfaces/staff-member';

export type Structure = FlaggedRequestFields;

let defaultRequestFields: Structure = {
  first_name: '',
  surname: '',
  date_of_birth: '',
  email_address: '',
  national_insurance_number: ''
};

const flaggedRequestFields = (state: Structure = defaultRequestFields, action: ActionWithPayload<any>): Structure => {
  switch (action.type) {
    case FILL_FLAGGED_REQUEST_FIELDS: {
      if (action.payload.model === 'formsData.basicInformationForm.firstName') {
        return {
          ...state,
          first_name: action.payload.value
        };
      }
      if (action.payload.model === 'formsData.basicInformationForm.surname') {
        return {
          ...state,
          surname: action.payload.value
        };
      }
      if (action.payload.model === 'formsData.basicInformationForm.dateOfBirth') {
        return {
          ...state,
          date_of_birth: action.payload.value.toISOString()
        };
      }
      if (action.payload.model === 'formsData.contactDetailsForm.email') {
        return {
          ...state,
          email_address: action.payload.value
        };
      }
      if (action.payload.model === 'formsData.workForm.nationalInsuranceNumber') {
        return {
          ...state,
          national_insurance_number: action.payload.value
        };
      }
      return state;
    }
    default: {
      return state;
    }
  }
};

export default flaggedRequestFields;

