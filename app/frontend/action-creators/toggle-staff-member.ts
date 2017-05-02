import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';
import {TOGGLE_STAFF_MEMBER} from '../constants/action-names';

type PayloadType = number;
export type ActionType = ActionWithPayload<PayloadType>;

const toggleStaffMembers = (value: PayloadType): ActionType =>
  createActionWithPayload(TOGGLE_STAFF_MEMBER, value);

export default toggleStaffMembers;
