import {VENUE_VALUES_CHANGED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';
import {Venue} from '../interfaces/common-data-types';

type PayloadType = Venue[];
export type ActionType = ActionWithPayload<PayloadType>;

const venueValuesChanged = (value: PayloadType): ActionType =>
  createActionWithPayload(VENUE_VALUES_CHANGED, value);

export default venueValuesChanged;
