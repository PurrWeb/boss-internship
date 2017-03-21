import {PENDING_STAFF_MEMBER_SAVE} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = boolean;
export type ActionType = ActionWithPayload<PayloadType>;

const pendingStaffMemberSave = (isInPending: PayloadType): ActionType =>
  createActionWithPayload(PENDING_STAFF_MEMBER_SAVE, isInPending);

export default pendingStaffMemberSave;
