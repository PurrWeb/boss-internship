import {ActionWithPayload} from '../interfaces/actions';
import {PAYRATES_CHANGED} from '../constants/action-names';
import {Payrate} from '../interfaces/common-data-types';

export type Structure = Payrate[];

const payrates = (state: Structure = [], action: ActionWithPayload<Structure>): Structure => {
  if (action.type === PAYRATES_CHANGED) {
    return action.payload;
  } else {
    return state;
  }
};

export default payrates;
