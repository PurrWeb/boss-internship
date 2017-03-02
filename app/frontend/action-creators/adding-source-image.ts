import {ADDING_SOURCE_IMAGE} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';

type PayloadType = string;
export type ActionType = ActionWithPayload<PayloadType>;

const addingSourceImage = (url: PayloadType): ActionType =>
  createActionWithPayload(ADDING_SOURCE_IMAGE, url);

export default addingSourceImage;
