import {GENDER_VALUES_CHANGED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = string[];
export type ActionType = ActionWithPayload<PayloadType>;

const genderValuesChanged = (value: PayloadType): ActionType =>
  createActionWithPayload(GENDER_VALUES_CHANGED, value);

export default genderValuesChanged;

