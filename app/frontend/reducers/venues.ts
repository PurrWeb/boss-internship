import {ActionWithPayload} from '../interfaces/actions';
import {VENUES_CHANGED} from '../constants/action-names';
import {Venue} from '../interfaces/common-data-types';

export type Structure = Venue[];

const venues = (state: Structure = [], action: ActionWithPayload<Structure>): Structure => {
  if (action.type === VENUES_CHANGED) {
    return action.payload;
  } else {
    return state;
  }
};

export default venues;
