import {AjaxResponse, AjaxError} from 'rxjs';
import {Reducer} from 'redux';

export interface IndexedDict<T> {
  readonly [name: number]: T;
}

export type PartialIndexedDict<T> = {
  [name: number]: T;
};

export interface Dict<T> {
  readonly [name: string]: T;
}

export interface StringDict extends Dict<string> {}
export interface BoolDict extends Dict<boolean> {}
export interface ObjDict extends Dict<{}> {}
export interface ArrDict<T> extends Dict< T[] > {}
export interface AnyDict extends Dict<any> {}

type BasicType = boolean | number | string;

export type Defined = BasicType | {};

export type OfType<Fields, TGoal> = {
  [Field in keyof Fields]: TGoal;
};

export type ReducersOfType<Fields> = {
  [Field in keyof Fields]: Reducer<Fields[Field]>;
};

interface CustomXHR<TResponse> extends XMLHttpRequest {
  readonly response: TResponse;
}

interface AjaxResponseTyped<TResponse> extends AjaxResponse {
  readonly status: 200;
  readonly response: TResponse | null;
}

export interface AjaxResponseDefined<TResponse> extends AjaxResponseTyped<TResponse> {
  readonly response: TResponse;
}

export interface AjaxErrorTyped<TResponse> extends AjaxError {
  readonly xhr: CustomXHR<TResponse>;
}
