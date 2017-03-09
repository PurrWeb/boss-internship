import {STAFF_TYPES_CHANGED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';
import {StaffType} from '../interfaces/common-data-types';

type PayloadType = StaffType[];
export type ActionType = ActionWithPayload<PayloadType>;

const staffTypesChanged = (value: PayloadType): ActionType =>
  createActionWithPayload(STAFF_TYPES_CHANGED, value);

export default staffTypesChanged;
