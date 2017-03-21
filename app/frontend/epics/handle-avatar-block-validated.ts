import {Store} from 'redux';
import {Epic} from 'redux-observable';
import {Observable} from 'rxjs';

import {AVATAR_BLOCK_VALIDATED} from '../constants/action-names';
import {StoreStructure} from '../interfaces/store-models';
import {SimpleAction} from '../interfaces/actions';
import completedStepsChanged from '../action-creators/completed-steps-changed';
import changingCurrentStep from '../action-creators/changing-current-step';
import {AddStaffMemberSteps} from '../constants/other';

const handleAvatarBlockValidated = ((action$, store: Store<StoreStructure>) => {
  return action$.ofType(AVATAR_BLOCK_VALIDATED)
    .mergeMap(() => {
      const stateData = store.getState();

      const {currentStep} = stateData.app;
      const completedStepsChangedAction = completedStepsChanged(AddStaffMemberSteps.AddAvatarBlock + 1);
      const currentStepChangedAction = changingCurrentStep(currentStep + 1);

      return Observable.of<SimpleAction>(
        completedStepsChangedAction,
        currentStepChangedAction
      );
    });
}) as Epic<SimpleAction, StoreStructure>;

export default handleAvatarBlockValidated;
