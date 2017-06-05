import {PENDING_REQUEST} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = boolean;
export type ActionType = ActionWithPayload<PayloadType>;

const pendingRequest = (isInPending: PayloadType): ActionType =>
  createActionWithPayload(PENDING_REQUEST, isInPending);

export default pendingRequest;
