import {CHANGING_STEP_INFO} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';
import {StepInfo} from '../interfaces/store-models';
import {AddStaffMemberSteps} from '../constants/other';

type StepName = keyof AddStaffMemberSteps;

export interface PayloadType extends StepInfo {
  readonly stepName: StepName;
}

export type ActionType = ActionWithPayload<PayloadType>;

const changingStepInfo = (stepName: StepName, touched: boolean, hasErrors: boolean): ActionType =>
  createActionWithPayload(CHANGING_STEP_INFO, {stepName, touched, hasErrors});

export default changingStepInfo;
