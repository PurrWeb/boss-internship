import {ActionWithPayload} from '../interfaces/actions';
import { FLAGGED_STAFF_MEMBERS, TOGGLE_STAFF_MEMBER } from '../constants/action-names';
import {StaffMember} from '../interfaces/staff-member';
import * as _ from 'lodash';

export type Structure = StaffMember[];

const staffMembers = (state: Structure = [], action: ActionWithPayload<any>): Structure => {
  switch (action.type) {
    case FLAGGED_STAFF_MEMBERS: {
      return action.payload.map((payloadItem: any) => {
        let equalItem = _.find(state, { 'id': payloadItem.id });
        return equalItem || payloadItem;
      });
    }
    case TOGGLE_STAFF_MEMBER: {
      return state.map(staffMember =>
        staffMember.id === action.payload ?
          { ...staffMember, reviewed: !staffMember.reviewed } :
          staffMember
      );
    }
    default: {
      return state;
    }
  }
};

export default staffMembers;

