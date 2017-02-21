import {ActionWithPayload} from '../../../interfaces/actions';
import {STAFF_TYPE_IDS_CHANGED} from '../../../constants/action-names';
import {StaffType} from '../../../interfaces/common-data-types';

export type Structure = StaffType[];

const staffTypeIds = (state: Structure = [], action: ActionWithPayload<Structure>): Structure => {
  if (action.type === STAFF_TYPE_IDS_CHANGED) {
    return action.payload;
  } else {
    return state;
  }
};

export default staffTypeIds;
