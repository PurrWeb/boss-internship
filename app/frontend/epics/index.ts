import {combineEpics} from 'redux-observable';

import handleBasicInformationBlockValidated from './handle-basic-information-block-validated';
import handleContactDetailsBlockValidated from './handle-contact-details-block-validated';
import handleVenuesInfoBlockValidated from './handle-venues-info-block-validated';
import handleWorkInfoBlockValidated from './handle-work-info-block-validated';
import requestStaffMemberSave from './request-staff-member-save';
import changeCurrentStep from './change-current-step';
import stepBackRegistration from './step-back-registration';
import validateAllAddStaffMemberStepForms from './validate-all-add-staff-member-step-forms';
import handleAvatarBlockValidated from './handle-avatar-block-validated';

export default combineEpics(
  validateAllAddStaffMemberStepForms,
  stepBackRegistration,
  changeCurrentStep,
  requestStaffMemberSave,
  handleBasicInformationBlockValidated,
  handleAvatarBlockValidated,
  handleContactDetailsBlockValidated,
  handleVenuesInfoBlockValidated,
  handleWorkInfoBlockValidated
);
