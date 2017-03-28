import {Store} from 'redux';
import {Epic} from 'redux-observable';
import {Observable} from 'rxjs';

import {BASIC_INFORMATION_BLOCK_VALIDATED} from '../constants/action-names';
import {StoreStructure} from '../interfaces/store-models';
import {SimpleAction} from '../interfaces/actions';
import completedStepsChanged from '../action-creators/completed-steps-changed';
import changingCurrentStep from '../action-creators/changing-current-step';
import {ADD_STAFF_MEMBER_STEPS} from '../constants/other';

const handleBasicInformationBlockValidated = ((action$, store: Store<StoreStructure>) => {
  return action$.ofType(BASIC_INFORMATION_BLOCK_VALIDATED)
    .mergeMap(() => {
      const stateData = store.getState();

      const {currentStepIdx} = stateData.app;
      const completedStepsChangedAction = completedStepsChanged(ADD_STAFF_MEMBER_STEPS.BasicInformationBlock + 1);
      const currentStepChangedAction = changingCurrentStep(currentStepIdx + 1);

      return Observable.of<SimpleAction>(
        completedStepsChangedAction,
        currentStepChangedAction
      );
    });
}) as Epic<SimpleAction, StoreStructure>;

export default handleBasicInformationBlockValidated;
