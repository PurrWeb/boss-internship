import {ActionWithPayload} from '../interfaces/actions';
import {ArrayErrors} from '../interfaces/store-models';
import {SAVE_STAFF_MEMBER_ERROR_HAPPENED, CLEAR_ERRORS} from '../constants/action-names';

export type Structure = ArrayErrors;

const errors = (state: Structure = {messages: [], date: 0}, action: ActionWithPayload<Structure>): Structure => {
  switch (action.type) {
    case SAVE_STAFF_MEMBER_ERROR_HAPPENED: {
      return action.payload;
    }
    case CLEAR_ERRORS: {
      return {messages: [], date: 0};
    }
    default: {
      return state;
    }
  }
};

export default errors;
