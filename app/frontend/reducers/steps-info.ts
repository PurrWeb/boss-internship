import {ActionWithPayload} from '../interfaces/actions';
import {STEPS_INFO_CHANGED} from '../constants/action-names';
import {AddStaffMemberStepsInfo} from '../interfaces/store-models';

export type Structure = AddStaffMemberStepsInfo;

const defaultData: Structure = {
  1: {
    touched: false,
    hasErrors: false
  },
  2: {
    touched: false,
    hasErrors: false
  },
  3: {
    touched: false,
    hasErrors: false
  },
  4: {
    touched: false,
    hasErrors: false
  },
  5: {
    touched: false,
    hasErrors: false
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
