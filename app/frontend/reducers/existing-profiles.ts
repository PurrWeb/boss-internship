import {ActionWithPayload} from '../interfaces/actions';
import {ExistingProfiles} from '../interfaces/store-models';
import {STAFF_MEMBERS_EXISTING_PROFILES} from '../constants/action-names';

export type Structure = ExistingProfiles[];

const existingProfiles = (state: Structure = [], action: ActionWithPayload<Structure>): Structure => {
  switch (action.type) {
    case STAFF_MEMBERS_EXISTING_PROFILES: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};

export default existingProfiles;
