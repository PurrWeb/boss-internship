import {Store} from 'redux';
import {Epic} from 'redux-observable';
import {Observable} from 'rxjs';

import {VENUES_INFO_BLOCK_VALIDATED} from '../constants/action-names';
import {StoreStructure} from '../interfaces/store-models';
import {SimpleAction} from '../interfaces/actions';
import completedStepsChanged from '../action-creators/completed-steps-changed';
import currentStepChanged from '../action-creators/current-step-changed';

const handleVenuesInfoBlockValidated = ((action$, store: Store<StoreStructure>) => {
  return action$.ofType(VENUES_INFO_BLOCK_VALIDATED)
    .mergeMap(() => {
      const stateData = store.getState();

      const {completedSteps, currentStep} = stateData.app;
      const completedStepsChangedAction = completedStepsChanged(completedSteps + 1);
      const currentStepChangedAction = currentStepChanged(currentStep + 1);

      return Observable.of<SimpleAction>(
        completedStepsChangedAction,
        currentStepChangedAction
      );
    });
}) as Epic<SimpleAction, StoreStructure>;

export default handleVenuesInfoBlockValidated;
