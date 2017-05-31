import {Store} from 'redux';
import {Epic} from 'redux-observable';
import {actionTypes} from 'react-redux-form';
import {REQUESTING_FLAGGED_STAFF_MEMBERS, FLAGGED_STAFF_MEMBERS} from '../constants/action-names';
import {StoreStructure} from '../interfaces/store-models';
import {SimpleAction, ActionWithPayload} from '../interfaces/actions';
import {ActionType} from '../action-creators/requesting-flagged-staff-members';
import requestingFlaggedStaffMembers from '../action-creators/requesting-flagged-staff-members';
import flaggedRequestFields from '../action-creators/flagged-request-fields';
import {showReviewed} from '../action-creators/reviewed';
import * as _ from 'lodash';

import {get} from '../helpers/requests';
import {Observable} from 'rxjs';
import {RequestFlaggedStaffMembers} from '../interfaces/api-requests';

const requestFlaggedStaffMembers = (action$: any, store: Store<StoreStructure>) =>
  action$.ofType(REQUESTING_FLAGGED_STAFF_MEMBERS)
    .switchMap((action: any) => {
        const isEmptyFields = !action.payload.first_name;
        const { reviewedStaffMembers } = store.getState().app;
        return isEmptyFields
          ? Observable.of({
              type: FLAGGED_STAFF_MEMBERS,
              payload: { flagged: [], reviewed: [] }
            })
          : get('/api/v1/staff_members/flagged', action.payload)
              .mergeMap((resp: any) => {
                if (resp.response.length) {
                  store.dispatch(showReviewed());
                }
                return Observable.of({
                  type: FLAGGED_STAFF_MEMBERS,
                  payload: { flagged: resp.response, reviewed: reviewedStaffMembers }
                }, );
              });
      }
    );

export default requestFlaggedStaffMembers;

