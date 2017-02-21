import {ActionWithPayload} from '../../../interfaces/actions';
import {CURRENT_STEP_CHANGED, REGISTRATION_STEP_BACK} from '../../../constants/action-names';

export type Structure = number;

const currentStep = (state: Structure = 0, action: ActionWithPayload<Structure>): Structure => {
  if (action.type === CURRENT_STEP_CHANGED) {
    return action.payload;
  } else if (action.type === REGISTRATION_STEP_BACK) {
    return state - 1;
  } else {
    return state;
  }
};

export default currentStep;
