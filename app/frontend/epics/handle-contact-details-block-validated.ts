import {Store} from 'redux';
import {Epic} from 'redux-observable';
import {Observable} from 'rxjs';

import {CONTACT_DETAILS_BLOCK_VALIDATED} from '../constants/action-names';
import {StoreStructure} from '../interfaces/store-models';
import {SimpleAction} from '../interfaces/actions';
import completedStepsChanged from '../action-creators/completed-steps-changed';
import currentStepChanged from '../action-creators/current-step-changed';
import {AddStaffMemberSteps} from '../constants/other';

const handleContactDetailsBlockValidated = ((action$, store: Store<StoreStructure>) => {
  return action$.ofType(CONTACT_DETAILS_BLOCK_VALIDATED)
    .mergeMap(() => {
      const stateData = store.getState();

      const {currentStep} = stateData.app;
      const completedStepsChangedAction = completedStepsChanged(AddStaffMemberSteps.ContactDetailsBlock + 1);
      const currentStepChangedAction = currentStepChanged(currentStep + 1);

      return Observable.of<SimpleAction>(
        completedStepsChangedAction,
        currentStepChangedAction
      );
    });
}) as Epic<SimpleAction, StoreStructure>;

export default handleContactDetailsBlockValidated;
