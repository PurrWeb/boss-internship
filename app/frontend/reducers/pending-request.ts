import {ActionWithPayload} from '../interfaces/actions';
import {PENDING_REQUEST} from '../constants/action-names';

export type Structure = boolean;

const pendingRequest = (state: Structure = false, action: ActionWithPayload<Structure>): Structure => {
  if (action.type === PENDING_REQUEST) {
    return action.payload;
  } else {
    return state;
  }
};

export default pendingRequest;
