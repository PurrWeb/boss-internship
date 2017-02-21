import {ActionWithPayload} from '../../../interfaces/actions';
import {GENDER_VALUES_CHANGED} from '../../../constants/action-names';

export type Structure = string[];

const genderValues = (state: Structure = [], action: ActionWithPayload<Structure>): Structure => {
  if (action.type === GENDER_VALUES_CHANGED) {
    return action.payload;
  } else {
    return state;
  }
};

export default genderValues;
