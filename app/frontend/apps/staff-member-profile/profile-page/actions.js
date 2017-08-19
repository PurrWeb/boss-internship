import { createAction } from 'redux-actions';

import {
  INITIAL_LOAD,
  UPDATE_STAFF_MEMBER,
} from './constants';

export const initialProfileDetailsLoad = createAction(INITIAL_LOAD);
export const updateStaffMember = createAction(UPDATE_STAFF_MEMBER);
