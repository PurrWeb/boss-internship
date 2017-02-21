import {StringDict} from '../interfaces/index';
import {CONTACT_DETAILS_BLOCK_VALIDATED} from '../constants/action-names';
import {ActionWithPayload} from '../interfaces/actions';
import {createActionWithPayload} from '../helpers/actions';

type PayloadType = StringDict;
export type ActionType = ActionWithPayload<PayloadType>;

const contactDetailsBlockValidated = (value: PayloadType): ActionType =>
  createActionWithPayload(CONTACT_DETAILS_BLOCK_VALIDATED, value);

export default contactDetailsBlockValidated;
