import {combineReducers} from 'redux';

import {ReducersOfType} from '../interfaces/index';
import completedSteps, {Structure as CompletedStepsStructure} from './completed-steps';
import currentStep, {Structure as CurrentStepStructure} from './current-step';
import isAllStepsPassed, {Structure as IsAllStepsPassedStructure} from './is-all-steps-passed';
import accessToken, {Structure as AccessTokenStructure} from './access-token';
import venueValues, {Structure as VenueValuesStructure} from './venue-values';
import payrateValues, {Structure as PayrateValuesStructure} from './payrate-values';
import staffTypeIds, {Structure as StaffTypeIdsStructure} from './staff-type-ids';
import genderValues, {Structure as GenderValuesStructure} from './gender-values';

export interface Structure {
  readonly completedSteps: CompletedStepsStructure;
  readonly currentStep: CurrentStepStructure;
  readonly isAllStepsPassed: IsAllStepsPassedStructure;
  readonly accessToken: AccessTokenStructure;
  readonly venueValues: VenueValuesStructure;
  readonly payrateValues: StaffTypeIdsStructure;
  readonly staffTypeIds: StaffTypeIdsStructure;
  readonly genderValues: GenderValuesStructure;
}

const reducers: ReducersOfType<Structure> = {
  completedSteps,
  currentStep,
  isAllStepsPassed,
  accessToken,
  venueValues,
  payrateValues,
  staffTypeIds,
  genderValues
};

const app = combineReducers<Structure>(reducers);

export default app;
