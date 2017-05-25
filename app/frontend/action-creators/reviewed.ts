import {SHOW_REVIEWED, HIDE_REVIEWED, TOGGLE_REVIEWED} from '../constants/action-names';
import {createActionWithPayload, createSimpleAction} from '../helpers/actions';
import {ActionWithPayload, SimpleAction} from '../interfaces/actions';

type PayloadType = boolean;
export type ActionType = ActionWithPayload<PayloadType>;

export const showReviewed = (): ActionType =>
  createActionWithPayload(SHOW_REVIEWED, true);

export const hideReviewed = (): ActionType =>
  createActionWithPayload(HIDE_REVIEWED, false);

export const toggleReviewed = (): SimpleAction =>
  createSimpleAction(TOGGLE_REVIEWED);

