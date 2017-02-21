import {STAFF_TYPES_CHANGED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';
import {OptionData} from '../interfaces/common-data-types';

type PayloadType = OptionData[];
export type ActionType = ActionWithPayload<PayloadType>;

const staffTypesChanged = (value: PayloadType): ActionType =>
  createActionWithPayload(STAFF_TYPES_CHANGED, value);

export default staffTypesChanged;
