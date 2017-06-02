import {CHANGING_CURRENT_STEP} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = number;
export type ActionType = ActionWithPayload<PayloadType>;

const changingCurrentStep = (currentStepIdx: PayloadType): ActionType =>
  createActionWithPayload(CHANGING_CURRENT_STEP, currentStepIdx);

export default changingCurrentStep;
