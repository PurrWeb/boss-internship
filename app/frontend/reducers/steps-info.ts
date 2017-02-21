import {ActionWithPayload} from '../interfaces/actions';
import {STEPS_INFO_CHANGED} from '../constants/action-names';
import {StepsInfo} from '../interfaces/store-models';

export type Structure = StepsInfo;

const stepsInfo = (state: Structure = {}, action: ActionWithPayload<Structure>): Structure => {
  if (action.type === STEPS_INFO_CHANGED) {
    return action.payload;
  } else {
    return state;
  }
};

export default stepsInfo;
