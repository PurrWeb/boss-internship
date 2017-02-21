import {ActionWithPayload} from '../../../interfaces/actions';
import {PAYRATE_VALUES_CHANGED} from '../../../constants/action-names';
import {Payrate} from '../../../interfaces/common-data-types';

export type Structure = Payrate[];

const payrateValues = (state: Structure = [], action: ActionWithPayload<Structure>): Structure => {
  if (action.type === PAYRATE_VALUES_CHANGED) {
    return action.payload;
  } else {
    return state;
  }
};

export default payrateValues;
