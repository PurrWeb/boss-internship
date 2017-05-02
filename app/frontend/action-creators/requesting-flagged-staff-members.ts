import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';
import {REQUESTING_FLAGGED_STAFF_MEMBERS} from '../constants/action-names';

type PayloadType = string;
export type ActionType = ActionWithPayload<PayloadType>;

const requestingFlaggedStaffMembers = (value: PayloadType): ActionType =>
  createActionWithPayload(REQUESTING_FLAGGED_STAFF_MEMBERS, value);

export default requestingFlaggedStaffMembers;
