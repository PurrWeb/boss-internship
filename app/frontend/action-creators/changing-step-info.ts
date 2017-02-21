import {CHANGING_STEP_INFO} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';
import {StepInfo} from '../interfaces/store-models';
import {AddStaffMemberSteps} from '../constants/other';

type StepIdx = AddStaffMemberSteps.BasicInformationBlock | AddStaffMemberSteps.AddAvatarBlock | AddStaffMemberSteps.VenuesBlock | AddStaffMemberSteps.ContactDetailsBlock | AddStaffMemberSteps.WorkBlock;

export interface PayloadType extends StepInfo {
  readonly stepIdx: StepIdx;
}

export type ActionType = ActionWithPayload<PayloadType>;

const changingStepInfo = (stepIdx: StepIdx, touched: boolean, hasErrors: boolean): ActionType =>
  createActionWithPayload(CHANGING_STEP_INFO, {stepIdx, touched, hasErrors});

export default changingStepInfo;
