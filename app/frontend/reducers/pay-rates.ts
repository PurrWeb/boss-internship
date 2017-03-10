import {ActionWithPayload} from '../interfaces/actions';
import {PAY_RATES_CHANGED} from '../constants/action-names';
import {OptionData} from '../interfaces/common-data-types';

export type Structure = OptionData[];

const payRates = (state: Structure = [], action: ActionWithPayload<Structure>): Structure => {
  if (action.type === PAY_RATES_CHANGED) {
    return action.payload;
  } else {
    return state;
  }
};

export default payRates;
