import {CHANGING_STEP_INFO} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';
import {StepInfo, AddStaffMemberStepName} from '../interfaces/store-models';

export interface PayloadType extends StepInfo {
  readonly stepName: AddStaffMemberStepName;
}

export type ActionType = ActionWithPayload<PayloadType>;

const changingStepInfo = (stepName: AddStaffMemberStepName, touched: boolean, hasErrors: boolean): ActionType =>
  createActionWithPayload(CHANGING_STEP_INFO, {stepName, touched, hasErrors});

export default changingStepInfo;
