import {ActionWithPayload} from '../../../interfaces/actions';
import {COMPLETED_STEPS_CHANGED} from '../../../constants/action-names';

export type Structure = number;

const completedSteps = (state: Structure = 0, action: ActionWithPayload<Structure>): Structure => {
  if (action.type === COMPLETED_STEPS_CHANGED) {
    return action.payload;
  } else {
    return state;
  }
};

export default completedSteps;
