import {ActionWithPayload} from '../interfaces/actions';
import {ADDING_SOURCE_IMAGE} from '../constants/action-names';

export type Structure = string;

const sourceImage = (state: Structure = '', action: ActionWithPayload<Structure>): Structure => {
  if (action.type === ADDING_SOURCE_IMAGE) {
    return action.payload;
  } else {
    return state;
  }
};

export default sourceImage;
