import {AVATAR_ADDED} from '../constants/action-names';
import {ActionWithPayload} from '../interfaces/actions';
import {createActionWithPayload} from '../helpers/actions';

type PayloadType = string;
export type ActionType = ActionWithPayload<PayloadType>;

const avatarAdded = (value: PayloadType): ActionType =>
  createActionWithPayload(AVATAR_ADDED, value);

export default avatarAdded;
