import {FLAGGED_STAFF_MEMBERS} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = {};
export type ActionType = ActionWithPayload<PayloadType>;

const flaggedStaffMembers = (staffMembers: PayloadType): ActionType =>
  createActionWithPayload(FLAGGED_STAFF_MEMBERS, staffMembers);

export default flaggedStaffMembers;
