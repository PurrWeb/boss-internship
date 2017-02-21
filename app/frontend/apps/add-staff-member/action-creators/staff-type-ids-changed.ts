import {STAFF_TYPE_IDS_CHANGED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';
import {StaffType} from '../interfaces/common-data-types';

type PayloadType = StaffType[];
export type ActionType = ActionWithPayload<PayloadType>;

const staffTypeIdsChanged = (value: PayloadType): ActionType =>
  createActionWithPayload(STAFF_TYPE_IDS_CHANGED, value);

export default staffTypeIdsChanged;
