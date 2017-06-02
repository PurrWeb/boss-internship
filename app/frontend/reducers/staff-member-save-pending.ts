import {ActionWithPayload} from '../interfaces/actions';
import {PENDING_STAFF_MEMBER_SAVE} from '../constants/action-names';

export type Structure = boolean;

const staffMemberSavePending = (state: Structure = false, action: ActionWithPayload<Structure>): Structure => {
  if (action.type === PENDING_STAFF_MEMBER_SAVE) {
    return action.payload;
  } else {
    return state;
  }
};

export default staffMemberSavePending;
