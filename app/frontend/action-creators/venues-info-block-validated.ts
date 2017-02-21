import {StringDict} from '../interfaces/index';
import {VENUES_INFO_BLOCK_VALIDATED} from '../constants/action-names';
import {ActionWithPayload} from '../interfaces/actions';
import {createActionWithPayload} from '../helpers/actions';

type PayloadType = StringDict;
export type ActionType = ActionWithPayload<PayloadType>;

const venuesInfoBlockValidated = (value: PayloadType): ActionType =>
  createActionWithPayload(VENUES_INFO_BLOCK_VALIDATED, value);

export default venuesInfoBlockValidated;
