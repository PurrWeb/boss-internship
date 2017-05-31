import {ActionWithPayload} from '../interfaces/actions';
import { SAVE_REVIEWED_MEMBER, REMOVE_REVIEWED_MEMBER } from '../constants/action-names';
import {StaffMember} from '../interfaces/staff-member';
import * as _ from 'lodash';

export type Structure = StaffMember[];

const reviewedStaffMembers = (state: Structure = [], action: ActionWithPayload<any>): Structure => {
  switch (action.type) {
    case SAVE_REVIEWED_MEMBER: {
        return [...state, action.payload];
    }
    case REMOVE_REVIEWED_MEMBER: {
      return state.filter(({ id }) => id !== action.payload);
    }
    default: {
      return state;
    }
  }
};

export default reviewedStaffMembers;

