import {ActionWithPayload} from '../interfaces/actions';
import { FLAGGED_STAFF_MEMBERS, TOGGLE_STAFF_MEMBER, REQUESTING_FLAGGED_STAFF_MEMBERS } from '../constants/action-names';
import {StaffMember} from '../interfaces/staff-member';
import * as _ from 'lodash';

export type Structure = StaffMember[];

const staffMembers = (state: Structure = [], action: ActionWithPayload<any>): Structure => {
  switch (action.type) {
    case FLAGGED_STAFF_MEMBERS: {
      const { flagged, reviewed } = action.payload;
      return flagged.map((flaggedMember: any) => {
        let equalFlaggedMember = _.find(reviewed, { 'id': flaggedMember.id });
        return equalFlaggedMember || flaggedMember;
      });
    }
    case TOGGLE_STAFF_MEMBER: {
      return state.map(staffMember =>
        staffMember.id === action.payload.id ?
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

