import {Store} from 'redux';
import {Epic} from 'redux-observable';
import {Observable} from 'rxjs';

import {AVATAR_ADDED} from '../constants/action-names';
import {StoreStructure} from '../interfaces/store-models';
import {SimpleAction} from '../interfaces/actions';
import completedStepsChanged from '../action-creators/completed-steps-changed';
import currentStepChanged from '../action-creators/current-step-changed';
import {AddStaffMemberSteps} from '../constants/other';

const handleAvatarAdded = ((action$, store: Store<StoreStructure>) => {
  return action$.ofType(AVATAR_ADDED)
    .mergeMap(() => {
      const stateData = store.getState();

      const {currentStep} = stateData.app;
      const completedStepsChangedAction = completedStepsChanged(AddStaffMemberSteps.AddAvatarBlock + 1);
      const currentStepChangedAction = currentStepChanged(currentStep + 1);

      return Observable.of<SimpleAction>(
        completedStepsChangedAction,
        currentStepChangedAction
      );
    });
}) as Epic<SimpleAction, StoreStructure>;

export default handleAvatarAdded;
