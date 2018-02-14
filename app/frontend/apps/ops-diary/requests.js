import axios from 'axios';
import globalNotification from '~/components/global-notification';
import { filterQueryString } from './components/ops-diaries-filter/utils';
import oFetch from 'o-fetch';

function http() {
  const instance = axios.create();
  instance.defaults.headers.common['Authorization'] = `Token token="${
    window.boss.accessToken
  }"`;

  return instance;
}

export function fetchDiaries(filterParams) {
  const queryString = filterQueryString(filterParams);
  return http().get(`/api/v1/ops-diaries?${queryString}`);
}

export function createDiary(values) {
  return http().post(`/api/v1/ops-diaries`, values);
}

export function updateDiary(values) {
  console.log(values);
  return http().put(`/api/v1/ops-diaries/${oFetch(values, 'id')}`, values);
}

export function enableDiary(diaryId) {
  return http().post(`/api/v1/ops-diaries/${diaryId}/enable`);
}

export function disableDiary(diaryId) {
  return http().post(`/api/v1/ops-diaries/${diaryId}/disable`);
}
