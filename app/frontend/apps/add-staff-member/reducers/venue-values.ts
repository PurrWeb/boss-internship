import {ActionWithPayload} from '../../../interfaces/actions';
import {VENUE_VALUES_CHANGED} from '../../../constants/action-names';
import {Venue} from '../../../interfaces/common-data-types';

export type Structure = Venue[];

const venueValues = (state: Structure = [], action: ActionWithPayload<Structure>): Structure => {
  if (action.type === VENUE_VALUES_CHANGED) {
    return action.payload;
  } else {
    return state;
  }
};

export default venueValues;
