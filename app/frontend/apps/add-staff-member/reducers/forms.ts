import {combineForms, FieldState, FormState} from 'react-redux-form';
import {OfType} from '../../../interfaces/index';
import {
  BasicInformationFormFields, UploadPhotoFormFields, ContactDetailsFormFields,
  VenueFormFields, WorkFormFields
} from '../../../interfaces/store-models';

interface FormStateWithValue<TValue> extends FormState {
  readonly initialValue: TValue;
  readonly value: TValue;
}

type FormStructure<FormFields> = OfType<FormFields, FieldState> & {
  $form: FormStateWithValue< OfType<FormFields, string> >;
};

interface FormModels {
  readonly basicInformationForm: BasicInformationFormFields;
  readonly uploadPhotoForm: OfType<UploadPhotoFormFields, string>;
  readonly contactDetailsForm: OfType<ContactDetailsFormFields, string>;
  readonly venueForm: OfType<VenueFormFields, string>;
  readonly workForm: OfType<WorkFormFields, string>;
}

const formsData = combineForms({
  basicInformationForm: {
    firstName: '',
    surname: '',
    gender: '',
    dateOfBirth: ''
  },
  uploadPhotoForm: {
    avatar: ''
  },
  contactDetailsForm: {
    email: '',
    address: '',
    country: '',
    postCode: '',
    phoneNumber: ''
  },
  venueForm : {
    mainVenue: '',
    otherVenues: '',
    startsAt: ''
  },
  workForm : {
    staffType: '',
    siaBadgeNumber: '',
    siaBadgeExpiryDate: '',
    pinCode: '',
    nationalInsuranceNumber: '',
    dayPreference: '',
    hoursPreference: '',
    payRate: '',
    starterEmploymentStatus: ''
  },
}, 'formsData');

export type BasicInformationForm = FormStructure<BasicInformationFormFields>;
export type UploadPhotoForm = FormStructure<UploadPhotoFormFields>;
export type ContactDetailsForm = FormStructure<ContactDetailsFormFields>;
export type VenueForm = FormStructure<VenueFormFields>;
export type WorkForm = FormStructure<WorkFormFields>;

export interface Structure extends FormModels {
  readonly forms: {
    basicInformationForm: BasicInformationForm;
    uploadPhotoForm: UploadPhotoForm;
    contactDetailsForm: ContactDetailsForm;
    venueForm: VenueForm;
    workForm: WorkForm;
    $form: FormStateWithValue<FormModels>;
  };
}

export default formsData;

