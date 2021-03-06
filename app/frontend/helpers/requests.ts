import {Observable, AjaxResponse, AjaxError} from 'rxjs';
import * as queryString from 'query-string';
import {pipe} from 'ramda';
import * as _ from 'lodash';
// tslint:disable-next-line:no-require-imports
const humanize = require('string-humanize');

import {AjaxResponseDefined, Defined} from '../interfaces/index';
import {
  STATUS_OK, STATUS_BAD_REQUEST, STATUS_UNAUTHORIZED,
  STATUS_FORBIDDEN, STATUS_NOT_FOUND, STATUS_REQUEST_TIMEOUT, STATUS_UNPROCESSABLE_ENTITY, STATUS_INTERNAL_SERVER_ERROR,
  STATUS_SERVICE_UNAVAILABLE
} from '../constants/used-http-status-codes';
import {ActionWithPayload} from '../interfaces/actions';
import saveStaffMemberErrorHappened from '../action-creators/save-staff-member-error-happened';
import globalErrorHappened from '../action-creators/global-error-happened';
import {GlobalError, ArrayErrors} from '../interfaces/store-models';
import store from '../store/index';

const handleError = (ajaxErrorData: AjaxError): Observable<AjaxError> => {
  /*if (ajaxErrorData.status === 401) {
    store.dispatch(logOutActionCreator());
  }*/
  return Observable.of(ajaxErrorData);
};

const getExtendedHeaders = (headers = {}): Object => {
  const token = store.getState().app.accessToken || '';
  const dataToAdd = token ? {
      Authorization: `Token token="${token}"`
    } : {};

  return {...dataToAdd, ...headers};
};

/*
const prolongSession = (ajaxData: AjaxResponse) => {
  if (isLogged()) {
    savePingTime();
  } else {
    logOut();
  }

  return ajaxData;
};
*/

export function get(url: string): Observable<AjaxResponse | AjaxError>;
export function get<TData>(url: string, dataToSend?: TData): Observable<AjaxResponse | AjaxError>;
export function get<TData, THeaders extends {}>(url: string, dataToSend?: TData, headers: THeaders = {} as THeaders):
    Observable<AjaxResponse | AjaxError> {
  const serializedData = queryString.stringify(dataToSend);
  const extendedHeaders = getExtendedHeaders(headers);
  const newUrl = `${url}?${serializedData}`;

  return Observable.ajax.get(newUrl, extendedHeaders)
  // .map(prolongSession)
    .catch((ajaxErrorData: AjaxError) => {
      return handleError(ajaxErrorData);
    });
}

export const post = (url: string, body?: any, headers = {}): Observable<AjaxResponse | AjaxError> => {
  if (typeof body === 'object') {
    const headersToAdd = {
      'Content-Type': 'application/json'
    };

    headers = {...headersToAdd, ...headers};
  }
  const extendedHeaders = getExtendedHeaders(headers);

  return Observable.ajax.post(url, body, extendedHeaders)
    // .map(prolongSession)
    .catch((ajaxErrorData: AjaxError) => {
      return handleError(ajaxErrorData);
    });
};

export const request = (method: string, url: string, body?: any, headers = {}): Observable<AjaxResponse | AjaxError> => {
  const extendedHeaders = getExtendedHeaders(headers);

  return Observable.ajax({
    method,
    url,
    body,
    headers: extendedHeaders
  })
  // .map(prolongSession)
    .catch((ajaxErrorData: AjaxError) => {
      return handleError(ajaxErrorData);
    });
};

export const isAjaxResponseDefined = < TResponseDefined extends AjaxResponseDefined<Defined> >
  (ajaxResponse: AjaxResponse | AjaxError): ajaxResponse is TResponseDefined => {
  const responseField = (ajaxResponse as any)!.response;

  return responseField !== undefined && responseField !== null && ajaxResponse!.status === STATUS_OK;
};

export const isAjaxError = (ajaxData: any): ajaxData is AjaxError => {
  return ajaxData.status !== STATUS_OK;
};

const ajaxStatusMessages = {
  [STATUS_BAD_REQUEST]: 'Bad request',
  [STATUS_UNAUTHORIZED]: 'Unauthorized',
  [STATUS_FORBIDDEN]: 'Forbidden',
  [STATUS_NOT_FOUND]: 'Not found',
  [STATUS_REQUEST_TIMEOUT]: 'Request timeout',
  [STATUS_UNPROCESSABLE_ENTITY]: 'Unprocessable entity',
  [STATUS_INTERNAL_SERVER_ERROR]: 'Internal server error',
  [STATUS_SERVICE_UNAVAILABLE]: 'Service unavailable'
};

export const getMessageFromAjaxErrorStatus = (ajaxError: AjaxError): string[] => {
  if (!ajaxError.xhr.response || !ajaxError.xhr.response.errors) {
    return [ajaxStatusMessages[ajaxError.status]] || ['Some strange error'];
  } else {
    const errors = ajaxError.xhr.response.errors;
    let errorsArray: string[] = [];
    _.each(errors, (items, errorGroup) => {
      const group = humanize(errorGroup);
      errorsArray.push(`${group}: ${items.join(', ')}`);
    });
    return errorsArray;
  }
};

export const getRequestFailedAction = (ajaxErrorStatus: any, messagePrefix: string) => {
  return pipe< AjaxError, string|any[], string, ActionWithPayload<GlobalError> >(
    (ajaxError: AjaxError) => getMessageFromAjaxErrorStatus(ajaxError),
    (errorFromStatus: string) => `${messagePrefix}: ${errorFromStatus}`,
    globalErrorHappened
  )(ajaxErrorStatus);
};

export const getStaffMemberSaveFailedAction = (ajaxErrorStatus: any) => {
  return pipe< AjaxError, string[], ActionWithPayload<ArrayErrors> >(
    (ajaxError: AjaxError) => getMessageFromAjaxErrorStatus(ajaxError),
    saveStaffMemberErrorHappened
  )(ajaxErrorStatus);
};
