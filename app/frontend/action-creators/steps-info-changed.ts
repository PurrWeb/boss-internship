import {STEPS_INFO_CHANGED} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';
import {StepsInfo} from '../interfaces/store-models';

type PayloadType = StepsInfo;
export type ActionType = ActionWithPayload<PayloadType>;

const stepsInfoChanged = (stepsInfo: PayloadType): ActionType =>
  createActionWithPayload(STEPS_INFO_CHANGED, stepsInfo);

export default stepsInfoChanged;
