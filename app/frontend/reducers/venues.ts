import {ActionWithPayload} from '../interfaces/actions';
import {VENUES_CHANGED} from '../constants/action-names';
import {OptionData} from '../interfaces/common-data-types';

export type Structure = OptionData[];

const venues = (state: Structure = [], action: ActionWithPayload<Structure>): Structure => {
  if (action.type === VENUES_CHANGED) {
    return action.payload;
  } else {
    return state;
  }
};

export default venues;
