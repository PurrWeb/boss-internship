import {CHANGING_STEP_INFO} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';
import {AddStaffMemberStepInfo, AddStaffMemberStepName} from '../interfaces/store-models';

export interface PayloadType extends AddStaffMemberStepInfo {
  readonly stepName: AddStaffMemberStepName;
}

export type ActionType = ActionWithPayload<PayloadType>;

const changingStepInfo = (stepName: AddStaffMemberStepName, hasValidationErrors: boolean): ActionType =>
  createActionWithPayload(CHANGING_STEP_INFO, {stepName, hasValidationErrors});

export default changingStepInfo;
