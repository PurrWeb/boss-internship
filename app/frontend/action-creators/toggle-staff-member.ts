import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';
import {TOGGLE_STAFF_MEMBER, SAVE_REVIEWED_MEMBER, REMOVE_REVIEWED_MEMBER} from '../constants/action-names';

type PayloadType = any;
export type ActionType = ActionWithPayload<PayloadType>;

const toggleStaffMembers = (value: PayloadType) => (dispatch: any, getState: any) => {
  dispatch(createActionWithPayload(TOGGLE_STAFF_MEMBER, value));
  if (!!value.reviewed) {
    dispatch(createActionWithPayload(REMOVE_REVIEWED_MEMBER, value.id));
  } else {
    value.reviewed = true;
    dispatch(createActionWithPayload(SAVE_REVIEWED_MEMBER, value));
  }
};

export default toggleStaffMembers;
