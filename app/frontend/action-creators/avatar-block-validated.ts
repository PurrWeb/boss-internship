import {StringDict} from '../interfaces/index';
import {AVATAR_BLOCK_VALIDATED} from '../constants/action-names';
import {ActionWithPayload} from '../interfaces/actions';
import {createActionWithPayload} from '../helpers/actions';

type PayloadType = StringDict;

export type ActionType = ActionWithPayload<PayloadType>;

const avatarBlockValidated = (value: PayloadType): ActionType =>
  createActionWithPayload(AVATAR_BLOCK_VALIDATED, value);

export default avatarBlockValidated;
