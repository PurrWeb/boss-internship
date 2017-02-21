import {CURRENT_STEP_CHANGED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = number;
export type ActionType = ActionWithPayload<PayloadType>;

const currentStepChanged = (currentStep: PayloadType): ActionType =>
  createActionWithPayload(CURRENT_STEP_CHANGED, currentStep);

export default currentStepChanged;
