import {ActionWithPayload} from '../../../interfaces/actions';
import {ACCESS_TOKEN_CHANGED} from '../../../constants/action-names';

export type Structure = string;

const accessToken = (state: Structure = '', action: ActionWithPayload<Structure>): Structure => {
  if (action.type === ACCESS_TOKEN_CHANGED) {
    return action.payload;
  } else {
    return state;
  }
};

export default accessToken;
