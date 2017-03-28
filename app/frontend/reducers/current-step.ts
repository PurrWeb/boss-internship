import {ActionWithPayload} from '../interfaces/actions';
import {CURRENT_STEP_CHANGED} from '../constants/action-names';

export type Structure = number;

const currentStepIdx = (state: Structure = 0, action: ActionWithPayload<Structure>): Structure => {
  if (action.type === CURRENT_STEP_CHANGED) {
    return action.payload;
  } else {
    return state;
  }
};

export default currentStepIdx;
