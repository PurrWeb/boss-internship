import {FILL_FLAGGED_REQUEST_FIELDS} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = {};
export type ActionType = ActionWithPayload<PayloadType>;

const flaggedRequestFields = (value: PayloadType): ActionType =>
  createActionWithPayload(FILL_FLAGGED_REQUEST_FIELDS, value);

export default flaggedRequestFields;
