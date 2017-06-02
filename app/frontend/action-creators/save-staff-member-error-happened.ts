import {SAVE_STAFF_MEMBER_ERROR_HAPPENED} from '../constants/action-names';
import {ActionWithPayload} from '../interfaces/actions';
import {ArrayErrors} from '../interfaces/store-models';
import {createActionWithPayload} from '../helpers/actions';

export type ActionType = ActionWithPayload<ArrayErrors>;

const saveStaffMemberErrorHappened = (messages: string[]): ActionType => {
  const errors: ArrayErrors = {
    messages,
    date: Date.now()
  };

  return createActionWithPayload(SAVE_STAFF_MEMBER_ERROR_HAPPENED, errors);
};

export default saveStaffMemberErrorHappened;
