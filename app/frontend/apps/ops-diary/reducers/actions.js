import { createAction } from 'redux-actions';
import * as types from './types';

export const getDiaries = createAction(types.DIARIES_FETCH_REQUESTED);
export const createDiary = createAction(types.DIARY_CREATE_REQUESTED);
export const enableDiary = createAction(types.DIARY_ENABLE_REQUESTED);
export const disableDiary = createAction(types.DIARY_DISABLE_REQUESTED);
export const updateDiary = createAction(types.DIARY_UPDATE_REQUESTED);
