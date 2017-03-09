import {PAYRATES_CHANGED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';
import {Payrate} from '../interfaces/common-data-types';

type PayloadType = Payrate[];
export type ActionType = ActionWithPayload<PayloadType>;

const payratesChanged = (value: PayloadType): ActionType =>
  createActionWithPayload(PAYRATES_CHANGED, value);

export default payratesChanged;
