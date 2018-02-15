import { call, put, takeEvery, takeLatest, all } from 'redux-saga/effects';

import diaries from './diaries';

function* rootSaga() {
  yield all([...diaries]);
}

export default rootSaga;
