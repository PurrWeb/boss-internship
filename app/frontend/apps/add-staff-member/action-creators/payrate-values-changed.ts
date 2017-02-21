import {PAYRATE_VALUES_CHANGED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';
import {Payrate} from '../interfaces/common-data-types';

type PayloadType = Payrate[];
export type ActionType = ActionWithPayload<PayloadType>;

const payrateValuesChanged = (value: PayloadType): ActionType =>
  createActionWithPayload(PAYRATE_VALUES_CHANGED, value);

export default payrateValuesChanged;
