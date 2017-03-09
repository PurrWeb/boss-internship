import {ActionWithPayload} from '../interfaces/actions';
import {STAFF_TYPES_CHANGED} from '../constants/action-names';
import {StaffType} from '../interfaces/common-data-types';

export type Structure = StaffType[];

const staffTypes = (state: Structure = [], action: ActionWithPayload<Structure>): Structure => {
  if (action.type === STAFF_TYPES_CHANGED) {
    return action.payload;
  } else {
    return state;
  }
};

export default staffTypes;
