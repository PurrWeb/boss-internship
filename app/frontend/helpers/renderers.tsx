import * as React from 'react';
import {ErrorsProps, WrapperProps, CustomComponentProps, MapPropsProps} from 'react-redux-form';
import {pipe, values, filter} from 'ramda';

export const renderErrorsBlock: React.StatelessComponent<ErrorsProps & WrapperProps> =
  (props) => <div className="boss3-form-errors">{props.children}</div>;

export const renderErrorComponent: React.StatelessComponent<ErrorsProps & CustomComponentProps> =
  (props) => <div className="boss3-form-errors__error">{props.children}</div>;

const haveSomeErrors = (errors: {}): boolean => pipe<{}, boolean[], boolean[], boolean>(
  values,
  filter(Boolean),
  (arr) => !!arr.length
)(errors);

export const setInputClass = (mapPropsProps: MapPropsProps) => {
  const {fieldValue, className} = mapPropsProps;
  const errorClass = 'boss3-input_state_error';
  const isThereSomeErrors = haveSomeErrors(fieldValue.errors);
  const classNameWithoutErrors = className.replace(errorClass, '');

  return isThereSomeErrors && fieldValue.touched && !fieldValue.focus ?
    className.indexOf(errorClass) === -1 ? `${className} ${errorClass}` : classNameWithoutErrors :
    classNameWithoutErrors;
};
