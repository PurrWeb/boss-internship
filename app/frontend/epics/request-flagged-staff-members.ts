import {Store} from 'redux';
import {Epic} from 'redux-observable';
import {actionTypes} from 'react-redux-form';
import {REQUESTING_FLAGGED_STAFF_MEMBERS, FLAGGED_STAFF_MEMBERS} from '../constants/action-names';
import {StoreStructure} from '../interfaces/store-models';
import {SimpleAction, ActionWithPayload} from '../interfaces/actions';
import {ActionType} from '../action-creators/requesting-flagged-staff-members';
import requestingFlaggedStaffMembers from '../action-creators/requesting-flagged-staff-members';
import flaggedRequestFields from '../action-creators/flagged-request-fields';
import * as _ from 'lodash';

import {get} from '../helpers/requests';
import {Observable} from 'rxjs';
import {RequestFlaggedStaffMembers} from '../interfaces/api-requests';

const requestFlaggedStaffMembers = (action$: any, store: Store<StoreStructure>) =>
  action$.ofType(REQUESTING_FLAGGED_STAFF_MEMBERS)
    .switchMap((action: any) => {
        const isEmptyFields = !action.payload.first_name;
        return isEmptyFields
          ? Observable.of({
              type: FLAGGED_STAFF_MEMBERS,
              payload: []
            })
          : get('/api/v1/staff_members/flagged', action.payload)
              .map((resp: any) => {
                return {
                  type: FLAGGED_STAFF_MEMBERS,
                  payload: resp.response
                };
              });
      }
    );

export default requestFlaggedStaffMembers;

