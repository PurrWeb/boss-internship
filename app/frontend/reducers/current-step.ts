import {ActionWithPayload} from '../interfaces/actions';
import {CURRENT_STEP_CHANGED, STEPPING_BACK_REGISTRATION} from '../constants/action-names';

export type Structure = number;

const currentStep = (state: Structure = 0, action: ActionWithPayload<Structure>): Structure => {
  if (action.type === CURRENT_STEP_CHANGED) {
    return action.payload;
  } else if (action.type === STEPPING_BACK_REGISTRATION) {
    return state - 1;
  } else {
    return state;
  }
};

export default currentStep;
