import {CLEAR_ERRORS} from '../constants/action-names';
import {SimpleAction} from '../interfaces/actions';
import {ArrayErrors} from '../interfaces/store-models';
import {createSimpleAction} from '../helpers/actions';

export type ActionType = SimpleAction;

const clearErrors = (): ActionType => {
  return createSimpleAction(CLEAR_ERRORS);
};

export default clearErrors;
