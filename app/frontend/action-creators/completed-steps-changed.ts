import {COMPLETED_STEPS_CHANGED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = number;
export type ActionType = ActionWithPayload<PayloadType>;

const completedStepsChanged = (sumOfCompletedSteps: PayloadType): ActionType =>
  createActionWithPayload(COMPLETED_STEPS_CHANGED, sumOfCompletedSteps);

export default completedStepsChanged;
