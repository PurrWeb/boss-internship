import {ACCESS_TOKEN_CHANGED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = string;
export type ActionType = ActionWithPayload<PayloadType>;

const accessTokenChanged = (value: PayloadType): ActionType =>
  createActionWithPayload(ACCESS_TOKEN_CHANGED, value);

export default accessTokenChanged;
