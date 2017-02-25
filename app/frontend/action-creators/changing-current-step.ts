import {CHANGING_CURRENT_STEP} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = number;
export type ActionType = ActionWithPayload<PayloadType>;

const changingCurrentStep = (currentStep: PayloadType): ActionType =>
  createActionWithPayload(CHANGING_CURRENT_STEP, currentStep);

export default changingCurrentStep;
