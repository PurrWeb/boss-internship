import {combineReducers} from 'redux';

import {ReducersOfType} from '../interfaces/index';
import currentStepIdx, {Structure as CurrentStepStructure} from './current-step';
import staffMemberSavePending, {Structure as staffMemberSavePendingStructure} from './staff-member-save-pending';
import isAllStepsPassed, {Structure as IsAllStepsPassedStructure} from './is-all-steps-passed';
import accessToken, {Structure as AccessTokenStructure} from './access-token';
import sourceImage, {Structure as SourceImageStructure} from './source-image';
import venues, {Structure as VenuesStructure} from './venues';
import payRates, {Structure as PayratesStructure} from './pay-rates';
import staffTypes, {Structure as StaffTypesStructure} from './staff-types';
import genderValues, {Structure as GenderValuesStructure} from './gender-values';
import avatarPreview, {Structure as AvatarPreviewStructure} from './avatar-preview';
import stepsInfo, {Structure as StepsInfoStructure} from './steps-info';

export interface Structure {
  readonly avatarPreview: AvatarPreviewStructure;
  readonly stepsInfo: StepsInfoStructure;
  readonly currentStepIdx: CurrentStepStructure;
  readonly staffMemberSavePending: staffMemberSavePendingStructure;
  readonly isAllStepsPassed: IsAllStepsPassedStructure;
  readonly accessToken: AccessTokenStructure;
  readonly sourceImage: SourceImageStructure;
  readonly venues: VenuesStructure;
  readonly payRates: PayratesStructure;
  readonly staffTypes: StaffTypesStructure;
  readonly genderValues: GenderValuesStructure;
}

const reducers: ReducersOfType<Structure> = {
  avatarPreview,
  stepsInfo,
  currentStepIdx,
  staffMemberSavePending,
  isAllStepsPassed,
  accessToken,
  sourceImage,
  venues,
  payRates,
  staffTypes,
  genderValues
};

const app = combineReducers<Structure>(reducers);

export default app;
