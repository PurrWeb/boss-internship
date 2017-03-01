import {AVATAR_PREVIEW_CHANGED} from '../constants/action-names';
import {ActionWithPayload} from '../interfaces/actions';
import {createActionWithPayload} from '../helpers/actions';

type PayloadType = string;
export type ActionType = ActionWithPayload<PayloadType>;

const avatarPreviewChanged = (imgUrl: PayloadType): ActionType =>
  createActionWithPayload(AVATAR_PREVIEW_CHANGED, imgUrl);

export default avatarPreviewChanged;
