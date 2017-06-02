import {BASIC_INFORMATION_BLOCK_VALIDATED} from '../constants/action-names';
import {ActionWithPayload} from '../interfaces/actions';
import {createActionWithPayload} from '../helpers/actions';
import {BasicInformationFormFields} from '../interfaces/store-models';

type PayloadType = BasicInformationFormFields;
export type ActionType = ActionWithPayload<PayloadType>;

const basicInformationBlockValidated = (value: PayloadType): ActionType =>
  createActionWithPayload(BASIC_INFORMATION_BLOCK_VALIDATED, value);

export default basicInformationBlockValidated;
