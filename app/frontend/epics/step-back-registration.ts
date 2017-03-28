import {Store} from 'redux';
import {Epic} from 'redux-observable';

import {STEPPING_BACK_REGISTRATION} from '../constants/action-names';
import {StoreStructure} from '../interfaces/store-models';
import {SimpleAction} from '../interfaces/actions';
import changingCurrentStep from '../action-creators/changing-current-step';

const stepBackRegistration = ((action$, store: Store<StoreStructure>) => {
  return action$.ofType(STEPPING_BACK_REGISTRATION)
    .map(() => {
      const stateData = store.getState();
      const {currentStepIdx} = stateData.app;
      const goalStep = Math.max(currentStepIdx - 1, 0);

      return changingCurrentStep(goalStep);
    });
}) as Epic<SimpleAction, StoreStructure>;

export default stepBackRegistration;
