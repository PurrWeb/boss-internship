import {ActionWithPayload} from '../../../interfaces/actions';
import {IS_ALL_STEPS_PASSED_CHANGED} from '../../../constants/action-names';

export type Structure = boolean;

const isAllStepsPassed = (state: Structure = false, action: ActionWithPayload<Structure>): Structure => {
  if (action.type === IS_ALL_STEPS_PASSED_CHANGED) {
    return action.payload;
  } else {
    return state;
  }
};

export default isAllStepsPassed;
