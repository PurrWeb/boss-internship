import {Store} from 'redux';
import {Epic} from 'redux-observable';

import {CHANGING_CURRENT_STEP} from '../constants/action-names';
import {SimpleAction} from '../interfaces/actions';
import {ActionType} from '../action-creators/changing-current-step';
import {StoreStructure} from '../interfaces/store-models';
import {Observable} from 'rxjs';
import currentStepChanged from '../action-creators/current-step-changed';

const changeCurrentStep = ((action$, store: Store<StoreStructure>) => {
  return action$.ofType(CHANGING_CURRENT_STEP)
    .mergeMap((action: ActionType) => {
      const stepId = action.payload;
      const currentStepChangedAction = currentStepChanged(stepId);

      return Observable.of<SimpleAction>(
        currentStepChangedAction
      );
  });
}) as Epic<SimpleAction, StoreStructure>;

export default changeCurrentStep;
