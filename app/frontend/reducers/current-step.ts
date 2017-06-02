import {ActionWithPayload} from '../interfaces/actions';
import {CHANGE_TO} from '../constants/action-names';

export type Structure = number;

const currentStepIdx = (state: Structure = 0, action: ActionWithPayload<Structure>): Structure => {
  if (action.type === CHANGE_TO) {
    return action.payload;
  } else {
    return state;
  }
};

export default currentStepIdx;
