import {STAFF_MEMBERS_EXISTING_PROFILES} from '../constants/action-names';
import {ActionWithPayload} from '../interfaces/actions';
import {ExistingProfiles} from '../interfaces/store-models';
import {createActionWithPayload} from '../helpers/actions';

type PayloadType = ExistingProfiles[];
export type ActionType = ActionWithPayload<PayloadType>;

const storeExistingProfiles = (existingProfiles: PayloadType): ActionType => {
  return createActionWithPayload(STAFF_MEMBERS_EXISTING_PROFILES, existingProfiles);
};

export default storeExistingProfiles;
