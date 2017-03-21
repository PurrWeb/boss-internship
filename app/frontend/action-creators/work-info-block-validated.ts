import {StringDict} from '../interfaces/index';
import {WORK_INFO_BLOCK_VALIDATED} from '../constants/action-names';
import {ActionWithPayload} from '../interfaces/actions';
import {createActionWithPayload} from '../helpers/actions';

type PayloadType = StringDict;
export type ActionType = ActionWithPayload<PayloadType>;

const workInfoBlockValidated = (value: PayloadType): ActionType =>
  createActionWithPayload(WORK_INFO_BLOCK_VALIDATED, value);

export default workInfoBlockValidated;
