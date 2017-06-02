import {ActionWithPayload} from '../interfaces/actions';
import {STEPS_INFO_CHANGED} from '../constants/action-names';
import {AddStaffMemberStepsInfo} from '../interfaces/store-models';

export type Structure = AddStaffMemberStepsInfo;


const defaultData: Structure = {
  0: {
    visited: false,
    hasUnfilledRequired: false,
    hasValidationErrors: false
  },
  1: {
    visited: false,
    hasUnfilledRequired: false,
    hasValidationErrors: false
  },
  2: {
    visited: false,
    hasUnfilledRequired: false,
    hasValidationErrors: false
  },
  3: {
    visited: false,
    hasUnfilledRequired: false,
    hasValidationErrors: false
  },
  4: {
    visited: false,
    hasUnfilledRequired: false,
    hasValidationErrors: false
  }
};

const stepsInfo = (state: Structure = {...defaultData}, action: ActionWithPayload<Structure>): Structure => {
  if (action.type === STEPS_INFO_CHANGED) {
    return action.payload;
  } else {
    return state;
  }
};

export default stepsInfo;
