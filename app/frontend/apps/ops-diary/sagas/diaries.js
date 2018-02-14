import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import * as types from '../reducers/types';
import * as Api from '../requests';
import { startSubmit, stopSubmit } from 'redux-form';
import { SubmissionError } from 'redux-form/immutable';
import { getInitialFilterData } from '../components/ops-diaries-filter/utils';
import globalNotification from '~/components/global-notification';

export function* fetchDiaries({ payload }) {
  const { data, formId, resolve, reject } = payload;
  yield put(startSubmit(formId));
  try {
    const response = yield call(Api.fetchDiaries, data);
    yield put({ type: types.DIARIES_FETCH_SUCCEEDED, payload: response.data });
    if (resolve) {
      yield resolve();
    }
  } catch (e) {
    yield put({ type: types.DIARIES_FETCH_FAILED, message: e.message });
    if (reject) {
      yield reject(e.message);
    }
  } finally {
    yield put(stopSubmit(formId));
  }
}

export function* enableDiary({ payload }) {
  const { diaryId, resolve, reject } = payload;
  try {
    yield call(Api.enableDiary, diaryId);
    const response = yield call(Api.fetchDiaries, getInitialFilterData());
    yield put({ type: types.DIARIES_FETCH_SUCCEEDED, payload: response.data });
    globalNotification('Diary was enabled successfull', {
      interval: 3000,
      status: 'success',
    });
    yield resolve();
  } catch (e) {
    yield put({ type: types.DIARY_ENABLE_FAILED, message: e.message });
    globalNotification(`Diary enabling was failed: ${e.message}`, {
      interval: 3000,
      status: 'error',
    });
    yield reject(e.message);
  }
}

export function* disableDiary({ payload }) {
  const { diaryId, resolve, reject } = payload;
  try {
    yield call(Api.disableDiary, diaryId);
    const response = yield call(Api.fetchDiaries, getInitialFilterData());
    yield put({ type: types.DIARIES_FETCH_SUCCEEDED, payload: response.data });
    globalNotification('Diary was disabled successfull', {
      interval: 3000,
      status: 'success',
    });
    yield resolve();
  } catch (e) {
    yield put({ type: types.DIARY_DISABLE_FAILED, message: e.message });
    globalNotification(`Diary disabling was failed: ${e.message}`, {
      interval: 3000,
      status: 'error',
    });
    yield reject(e.message);
  }
}

export function* updateDiary({ payload }) {
  const { data, resolve, reject } = payload;
  try {
    yield call(Api.updateDiary, data);
    const response = yield call(Api.fetchDiaries, getInitialFilterData());
    yield put({ type: types.DIARIES_FETCH_SUCCEEDED, payload: response.data });
    globalNotification('Diary was updated successfull', {
      interval: 3000,
      status: 'success',
    });
    yield resolve();
  } catch (error) {
    yield put({ type: types.DIARY_UPDATE_FAILED, message: error.message });
    globalNotification(`Diary updating was failed: ${error.message}`, {
      interval: 3000,
      status: 'error',
    });
    if (error.response.status === 422) {
      const errors = error.response.data.errors;
      let base = {};
      if (errors) {
        if (errors.base) {
          base = {
            _error: errors.base,
          };
        }
      }
      yield reject(new SubmissionError({ ...errors, ...base }));
    } else {
      yield reject();
    }
  }
}

export function* createDiary({ payload }) {
  const { data, resolve, reject } = payload;
  try {
    yield call(Api.createDiary, data);
    const response = yield call(Api.fetchDiaries, getInitialFilterData());
    yield put({ type: types.DIARIES_FETCH_SUCCEEDED, payload: response.data });
    globalNotification('Diary was created successfull', {
      interval: 3000,
      status: 'success',
    });
    yield resolve();
  } catch (error) {
    yield put({ type: types.DIARY_CREATE_FAILED, message: error.message });
    globalNotification(`Diary creation was failed: ${error.message}`, {
      interval: 3000,
      status: 'error',
    });
    if (error.response.status === 422) {
      const errors = error.response.data.errors;
      let base = {};
      if (errors) {
        if (errors.base) {
          base = {
            _error: errors.base,
          };
        }
      }
      yield reject(new SubmissionError({ ...errors, ...base }));
    } else {
      yield reject();
    }
  }
}

export default [
  takeLatest(types.DIARIES_FETCH_REQUESTED, fetchDiaries),
  takeLatest(types.DIARY_CREATE_REQUESTED, createDiary),
  takeLatest(types.DIARY_ENABLE_REQUESTED, enableDiary),
  takeLatest(types.DIARY_DISABLE_REQUESTED, disableDiary),
  takeLatest(types.DIARY_UPDATE_REQUESTED, updateDiary),
];
