import {ActionWithPayload} from '../interfaces/actions';
import {AVATAR_PREVIEW_CHANGED} from '../constants/action-names';

export type Structure = string;

const avatarPreview = (imgUrl: Structure = '', action: ActionWithPayload<Structure>): Structure => {
  if (action.type === AVATAR_PREVIEW_CHANGED) {
    return action.payload;
  } else {
    return imgUrl;
  }
};

export default avatarPreview;
