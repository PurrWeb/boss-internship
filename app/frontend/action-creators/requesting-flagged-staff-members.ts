import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';
import flaggedRequestFields from './flagged-request-fields';
import {FlaggedRequestFields} from '../interfaces/staff-member';
import {REQUESTING_FLAGGED_STAFF_MEMBERS} from '../constants/action-names';
import { actions } from 'react-redux-form';

type PayloadType = FlaggedRequestFields;
export type ActionType = ActionWithPayload<PayloadType>;

const requestingFlaggedStaffMembers = (value: PayloadType): ActionType =>
  createActionWithPayload(REQUESTING_FLAGGED_STAFF_MEMBERS, value);

const flaggedFields = (field: any) => (dispatch: any, getState: any) => {
  const {model, value} = field;
  dispatch(actions.change(model, value));
  dispatch(flaggedRequestFields({model, value}));

  const requestFields = getState().app.flaggedFields;
  dispatch(requestingFlaggedStaffMembers(requestFields));
};

export default flaggedFields;
