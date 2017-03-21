import {IS_ALL_STEPS_PASSED_CHANGED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = boolean;
export type ActionType = ActionWithPayload<PayloadType>;

const isAllStepsPassedChanged = (value: PayloadType): ActionType =>
  createActionWithPayload(IS_ALL_STEPS_PASSED_CHANGED, {
    value
  });

export default isAllStepsPassedChanged;
