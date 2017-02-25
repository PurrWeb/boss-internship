import {combineEpics} from 'redux-observable';

import handleBasicInformationBlockValidated from './handle-basic-information-block-validated';
import handleAvatarAdded from './handle-avatar-added';
import handleContactDetailsBlockValidated from './handle-contact-details-block-validated';
import handleVenuesInfoBlockValidated from './handle-venues-info-block-validated';
import handleWorkInfoBlockValidated from './handle-work-info-block-validated';
import requestStaffMemberSave from './request-staff-member-save';
import changeCurrentStep from './change-current-step';
import stepBackRegistration from './step-back-registration';

export default combineEpics(
  stepBackRegistration,
  changeCurrentStep,
  requestStaffMemberSave,
  handleBasicInformationBlockValidated,
  handleContactDetailsBlockValidated,
  handleVenuesInfoBlockValidated,
  handleWorkInfoBlockValidated,
  handleAvatarAdded
);
