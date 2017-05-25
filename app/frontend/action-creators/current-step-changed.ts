import {CHANGE_TO} from '../constants/action-names';
import {createActionWithPayload} from '../helpers/actions';
import {ActionWithPayload} from '../interfaces/actions';
import {actions} from 'react-redux-form';

type PayloadType = number;
export type ActionType = ActionWithPayload<PayloadType>;

const changeTo = (currentStepIdx: PayloadType): ActionType =>
  createActionWithPayload(CHANGE_TO, currentStepIdx);

const changeStep = (formModel: string, step: PayloadType) => (dispatch: any, getState: any) => {
    dispatch(changeTo(step));
    if (!!formModel) {
      dispatch(actions.submit(formModel));
    };
};

export default changeStep;
