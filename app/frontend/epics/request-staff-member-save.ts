import {Observable, AjaxError} from 'rxjs';
import {Epic} from 'redux-observable';
// tslint:disable-next-line:no-require-imports
const t = require('tcomb-validation');

import {REQUESTING_STAFF_MEMBER_SAVE} from '../constants/action-names';
import {get, isAjaxResponseDefined, getRequestFailedAction} from '../helpers/requests';
import {ResponseStaffMemberCreateSuccessPayload} from '../interfaces/api-responses';
import {AjaxResponseTyped, AjaxResponseDefined} from '../interfaces/index';
import {urlStaffMembersEdit, urlStaffMembersRedirectTemplate} from '../constants/urls';
import {SimpleAction} from '../interfaces/actions';
import {StoreStructure} from '../interfaces/store-models';
import pendingStaffMemberSave from '../action-creators/pending-staff-member-save';
import {validateResponse} from '../helpers/dynamic-type-validators/index';

type ResponseOk = AjaxResponseTyped<ResponseStaffMemberCreateSuccessPayload>;
type ResponseOkDefined = AjaxResponseDefined<ResponseStaffMemberCreateSuccessPayload>;

const assertResponse = (ajaxData: ResponseOk) => {
  const tResponse = <ResponseStaffMemberCreateSuccessPayload>t.interface({
    staff_member_id: t.String
  });

  validateResponse(tResponse, ajaxData);
};

const requestStaffMemberSave = ((action$) => {
  return action$.ofType(REQUESTING_STAFF_MEMBER_SAVE)
    .switchMap(() => {
      const pendingStaffMemberSaveStart$ = Observable.of(pendingStaffMemberSave(true));
      const pendingStaffMemberSaveStopAction = pendingStaffMemberSave(false);

      const request$ = Observable.of(null)
        .mergeMap(() =>
          get(urlStaffMembersEdit)
            .mergeMap((ajaxData: ResponseOk | AjaxError) => {
              if ( isAjaxResponseDefined<ResponseOkDefined>(ajaxData) ) {
                assertResponse(ajaxData);
                const memberId = ajaxData.response.staff_member_id;

                location.pathname = urlStaffMembersRedirectTemplate.replace(/:id\b/, String(memberId));

                return Observable.of<SimpleAction>(
                  pendingStaffMemberSaveStopAction
                );
              } else {
                const requestFailedAction = getRequestFailedAction(ajaxData.status, 'Saving a staff member error');

                return Observable.of<SimpleAction>(
                  pendingStaffMemberSaveStopAction,
                  requestFailedAction
                );
              }
            })
        );

      return Observable.concat(
        pendingStaffMemberSaveStart$,
        request$
      );
    });
}) as Epic<SimpleAction, StoreStructure>;

export default requestStaffMemberSave;
