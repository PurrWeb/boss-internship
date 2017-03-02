import {combineReducers} from 'redux';

import {ReducersOfType} from '../interfaces/index';
import completedSteps, {Structure as CompletedStepsStructure} from './completed-steps';
import currentStep, {Structure as CurrentStepStructure} from './current-step';
import staffMemberSavePending, {Structure as staffMemberSavePendingStructure} from './staff-member-save-pending';
import isAllStepsPassed, {Structure as IsAllStepsPassedStructure} from './is-all-steps-passed';
import accessToken, {Structure as AccessTokenStructure} from './access-token';
import sourceImage, {Structure as SourceImageStructure} from './source-image';
import venueValues, {Structure as VenueValuesStructure} from './venue-values';
import payrateValues, {Structure as PayrateValuesStructure} from './payrate-values';
import staffTypeIds, {Structure as StaffTypeIdsStructure} from './staff-type-ids';
import genderValues, {Structure as GenderValuesStructure} from './gender-values';
import avatarPreview, {Structure as AvatarPreviewStructure} from './avatar-preview';

export interface Structure {
  readonly avatarPreview: AvatarPreviewStructure;
  readonly completedSteps: CompletedStepsStructure;
  readonly currentStep: CurrentStepStructure;
  readonly staffMemberSavePending: staffMemberSavePendingStructure;
  readonly isAllStepsPassed: IsAllStepsPassedStructure;
  readonly accessToken: AccessTokenStructure;
  readonly sourceImage: SourceImageStructure;
  readonly venueValues: VenueValuesStructure;
  readonly payrateValues: PayrateValuesStructure;
  readonly staffTypeIds: StaffTypeIdsStructure;
  readonly genderValues: GenderValuesStructure;
}

const reducers: ReducersOfType<Structure> = {
  avatarPreview,
  completedSteps,
  currentStep,
  staffMemberSavePending,
  isAllStepsPassed,
  accessToken,
  sourceImage,
  venueValues,
  payrateValues,
  staffTypeIds,
  genderValues
};

const app = combineReducers<Structure>(reducers);

export default app;
