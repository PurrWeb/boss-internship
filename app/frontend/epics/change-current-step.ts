import {Store} from 'redux';
import {Epic} from 'redux-observable';
import {Observable} from 'rxjs';

import {CHANGING_CURRENT_STEP} from '../constants/action-names';
import {SimpleAction} from '../interfaces/actions';
import {ActionType} from '../action-creators/changing-current-step';
import {StoreStructure} from '../interfaces/store-models';
import currentStepChanged from '../action-creators/current-step-changed';
import validatingAllAddStaffMemberStepFormsAction from '../action-creators/validating-all-add-staff-member-step-forms';

const changeCurrentStep = ((action$, store: Store<StoreStructure>) => {
  return action$.ofType(CHANGING_CURRENT_STEP)
    .mergeMap((action: ActionType) => {
      const stepId = action.payload;
      // const currentStepChangedAction = currentStepChanged(stepId);

      return Observable.of<any>(
        // validatingAllAddStaffMemberStepFormsAction
      );
  });
}) as Epic<SimpleAction, StoreStructure>;

export default changeCurrentStep;
