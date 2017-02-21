import {combineEpics} from 'redux-observable';

import handleBasicInformationBlockValidated from './handle-basic-information-block-validated';
import handleAvatarAdded from './handle-avatar-added';
import handleContactDetailsBlockValidated from './handle-contact-details-block-validated';
import handleVenuesInfoBlockValidated from './handle-venues-info-block-validated';
import handleWorkInfoBlockValidated from './handle-work-info-block-validated';

export default combineEpics(
  handleBasicInformationBlockValidated,
  handleContactDetailsBlockValidated,
  handleVenuesInfoBlockValidated,
  handleWorkInfoBlockValidated,
  handleAvatarAdded
);
