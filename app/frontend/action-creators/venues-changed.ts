import {VENUES_CHANGED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';
import {Venue} from '../interfaces/common-data-types';

type PayloadType = Venue[];
export type ActionType = ActionWithPayload<PayloadType>;

const venuesChanged = (value: PayloadType): ActionType =>
  createActionWithPayload(VENUES_CHANGED, value);

export default venuesChanged;
