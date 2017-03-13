import {Observable, AjaxError} from 'rxjs';
import {Epic} from 'redux-observable';
import {pipe, pickBy, isNil} from 'ramda';
// tslint:disable-next-line:no-require-imports
const t = require('tcomb-validation');

import {REQUESTING_STAFF_MEMBER_SAVE} from '../constants/action-names';
import {isAjaxResponseDefined, getRequestFailedAction, post} from '../helpers/requests';
import {ResponseStaffMemberCreateSuccessPayload} from '../interfaces/api-responses';
import {AjaxResponseTyped, AjaxResponseDefined, AnyDict} from '../interfaces/index';
import {urlStaffMembersEdit, urlStaffMembersRedirectTemplate} from '../constants/urls';
import {SimpleAction} from '../interfaces/actions';
import {StoreStructure} from '../interfaces/store-models';
import pendingStaffMemberSave from '../action-creators/pending-staff-member-save';
import {validateResponse} from '../helpers/dynamic-type-validators/index';
import {RequestStaffMemberSavePayload} from '../interfaces/api-requests';
import {Store} from 'redux';

type ResponseOk = AjaxResponseTyped<ResponseStaffMemberCreateSuccessPayload>;
type ResponseOkDefined = AjaxResponseDefined<ResponseStaffMemberCreateSuccessPayload>;

const assertResponse = (ajaxData: ResponseOk) => {
  const tResponse = <ResponseStaffMemberCreateSuccessPayload>t.interface({
    staff_member_id: t.String
  });

  validateResponse(tResponse, ajaxData);
};

const getDataToSend = (storeState: StoreStructure): RequestStaffMemberSavePayload => {
  const app = storeState.app;
  const {basicInformationForm, contactDetailsForm, venueForm, workForm} =
    storeState.formsData;

  return {
    pin_code: workForm.pinCode || null,
    gender: basicInformationForm.gender,
    phone_number: contactDetailsForm.phoneNumber || null,
    date_of_birth: basicInformationForm.dateOfBirth || null,
    starts_at: venueForm.startsAt || null,
    national_insurance_number: workForm.nationalInsuranceNumber || null,
    hours_preference_note: workForm.hoursPreference || null,
    day_preference_note: workForm.dayPreference || null,
    avatar_base64: app.avatarPreview,
    employment_status_a: workForm.starterEmploymentStatus === 'employment_status_a' || null,
    employment_status_b: workForm.starterEmploymentStatus === 'employment_status_b' || null,
    employment_status_c: workForm.starterEmploymentStatus === 'employment_status_c' || null,
    employment_status_d: workForm.starterEmploymentStatus === 'employment_status_d' || null,
    employment_status_p45_supplied: workForm.starterEmploymentStatus === 'employment_status_p45_supplied' || null,
    first_name: basicInformationForm.firstName || null,
    surname: basicInformationForm.surname || null,
    staff_type_id: workForm.staffType || null,
    address: contactDetailsForm.address || null,
    postcode: contactDetailsForm.postCode || null,
    country: contactDetailsForm.country || null,
    pay_rate_id: workForm.payRate,
    master_venue_id: venueForm.mainVenue || null,
    work_venue_ids: [1] || null,
    email_address: contactDetailsForm.email,
    sia_badge_number: workForm.siaBadgeNumber || null,
    sia_badge_expiry_date: workForm.siaBadgeExpiryDate || null
  };
};

const requestStaffMemberSave = ((action$, store: Store<StoreStructure>) => {
  return action$.ofType(REQUESTING_STAFF_MEMBER_SAVE)
    .switchMap(() => {
      const pendingStaffMemberSaveStart$ = Observable.of(pendingStaffMemberSave(true));
      const pendingStaffMemberSaveStopAction = pendingStaffMemberSave(false);
      const dataToSend = getDataToSend( store.getState() );

      const request$ = Observable.of(null)
        .mergeMap(() =>
          post(urlStaffMembersEdit, dataToSend)
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
