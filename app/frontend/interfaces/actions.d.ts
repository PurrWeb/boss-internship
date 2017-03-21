import {Action} from 'redux';

export interface SimpleAction extends Action {
  readonly type: string;
}

export interface ActionWithPayload<TPayload> extends SimpleAction {
  readonly payload: TPayload;
  readonly type: string;
  readonly [key: string]: any;
}

interface FormSubmitActionPayload {
  readonly formModelPath: string;
  readonly formData: any;
}

export type FormSubmitAction = ActionWithPayload<FormSubmitActionPayload>;
