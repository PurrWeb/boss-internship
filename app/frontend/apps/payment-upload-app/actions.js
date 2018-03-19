import oFetch from 'o-fetch';
import { createAction } from 'redux-actions';
import { uploadFileRequest } from './requests';
import {
  INITIALIZE,
  LOAD_REPORT,
  UPLOAD_ERROR,
  RESET_APPLICATION,
  SET_UPLOAD_IN_PROGRESS
} from './constants';

export const initializeState = createAction(INITIALIZE);
export const loadReportIntoState = createAction(LOAD_REPORT);
export const setStateUploadInProgress = createAction(SET_UPLOAD_IN_PROGRESS);
export const reportStateUploadError = createAction(UPLOAD_ERROR);
export const resetApplicationState = createAction(RESET_APPLICATION);

export const resetApplication = () => (dispatch, getState) => {
  dispatch(resetApplicationState());
}

export const uploadFile = (values) => (dispatch, getState) => {
  dispatch(setStateUploadInProgress(true))

  const state = getState().toJS();
  const globalState = oFetch(state, 'global');
  const accessToken = oFetch(globalState, 'accessToken');

  const fileReader = new FileReader();
  fileReader.onload = () => {
    const fileAsBinaryString = oFetch(fileReader, 'result');

    return uploadFileRequest({
      accessToken: accessToken,
      stringData: fileAsBinaryString
    })
    .then((resp) => {
      const data = oFetch(resp, 'data');
      dispatch(loadReportIntoState(data));
    }).catch((resp) => {
      const serverResponse = resp.response;
      let message = 'uploadFileRequestFailed '
      if (serverResponse && serverResponse.status){
        message = message + `code: ${serverResponse.status}`
      }
      const responseMessage = (serverResponse && serverResponse.message) || resp.message;
      if (responseMessage) {
        message = message + responseMessage
      }

      setTimeout(function() {
        throw new Error(message);
      })
      dispatch(setStateUploadInProgress(false));
      dispatch(reportStateUploadError({ message: responseMessage }));
    });
  };
  fileReader.onabort = () => reject('file reading aborted');
  fileReader.onerror = () => reject('file reading failed');

  fileReader.readAsBinaryString(oFetch(values, "file"));
}
