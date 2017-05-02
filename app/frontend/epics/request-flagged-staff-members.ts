import {Store} from 'redux';
import {Epic} from 'redux-observable';

import {REQUESTING_FLAGGED_STAFF_MEMBERS, FLAGGED_STAFF_MEMBERS} from '../constants/action-names';
import {StoreStructure} from '../interfaces/store-models';
import {SimpleAction, ActionWithPayload} from '../interfaces/actions';
import {ActionType} from '../action-creators/requesting-flagged-staff-members';
import requestingFlaggedStaffMembers from '../action-creators/requesting-flagged-staff-members';


import {get} from '../helpers/requests';
import {Observable} from 'rxjs';

const requestFlaggedStaffMembers = (action$: any, store: Store<StoreStructure>) =>
  action$.ofType(REQUESTING_FLAGGED_STAFF_MEMBERS)
    .mergeMap((action: any) => {
        return !!action.payload
          ? get('/api/v1/staff_members/flagged', {'staff_member_index_filter[name_text]': action.payload})
          .map((resp: any) => ({
              type: FLAGGED_STAFF_MEMBERS,
              payload: resp.response
            })
          )
          : Observable.of({
            type: FLAGGED_STAFF_MEMBERS,
            payload: []
          });
      }
    );

export default requestFlaggedStaffMembers;

