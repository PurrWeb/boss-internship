import {PAY_RATES_CHANGED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';
import {OptionData} from '../interfaces/common-data-types';

type PayloadType = OptionData[];
export type ActionType = ActionWithPayload<PayloadType>;

const payratesChanged = (value: PayloadType): ActionType =>
  createActionWithPayload(PAY_RATES_CHANGED, value);

export default payratesChanged;
