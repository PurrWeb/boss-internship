import {Store} from 'redux';
import {Epic} from 'redux-observable';

import {CHANGING_STEP_INFO} from '../constants/action-names';
import {StoreStructure, StepsInfo, StepInfo} from '../interfaces/store-models';
import {ActionWithPayload} from '../interfaces/actions';
import {ActionType} from '../action-creators/changing-step-info';
import stepsInfoChanged from '../action-creators/steps-info-changed';

const changeStepsInfo = ((action$, store: Store<StoreStructure>) => {
  return action$.ofType(CHANGING_STEP_INFO)
    .map((action: ActionType) => {
      const stateData = store.getState();
      const {stepIdx, touched, hasErrors} = action.payload;
      const changedStepInfo: StepInfo = {touched, hasErrors};
      const newStepsInfo: StepsInfo = {...stateData.app.stepsInfo, ...{[stepIdx]: changedStepInfo}};

      return stepsInfoChanged(newStepsInfo);
    });
}) as Epic<ActionWithPayload<StepsInfo>, StoreStructure>;

export default changeStepsInfo;
