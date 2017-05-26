/// <reference path="../../../custom-typings/react-redux-form.d.ts" />

import * as React from 'react';
import * as Select from 'react-select';
import {
  Control, ModelAction, MapProps, WrapperProps, ValidateOn, Validators, ControlProps,
  MapPropsProps
} from 'react-redux-form';
import SelectFixed from './react-select-fixed';
import {merge} from 'ramda';

import {setInputClass} from '../../../helpers/renderers';

interface Props {
  readonly model: string;
  readonly value?: any;
  readonly className?: string;
  readonly mapProps?: MapProps;
  readonly multi?: boolean;
  readonly options?: Select.Option[];
  readonly validateOn?: ValidateOn;
  readonly validators?: Validators;
  readonly searchable?: boolean;
}

interface State {
}

class SelectControl extends React.Component<Props, State> {
  localMapProps: MapProps;

  constructor(props: Props) {
    super(props);

    const valueFn = props.multi ?
      ((data: MapPropsProps) => (data.modelValue as Select.Option[]).length ? data.modelValue : props.value) :
      (data: MapPropsProps) => data.modelValue;

    this.localMapProps = {
      className: setInputClass,
      options: () => this.props.options,
      searchable: () => this.props.searchable,
      value: valueFn,
      onChange: (data: any) => {
        return data.onChange;
      }
    };
  }

  changeAction = (model: string, selectValue: Select.Option): ModelAction => {
    const value = this.props.multi ? selectValue : selectValue.value;

    return {
      type: 'rrf/change',
      model,
      value
    };
  };

  render() {
    const {className, model, multi, mapProps, validateOn, validators, value} = this.props;
    const mappedProps = merge(this.localMapProps, mapProps);

    return (
      <Control
        component={SelectFixed}
        className={className}
        model={model}
        value={value}
        multi={multi}
        changeAction={this.changeAction}
        mapProps={mappedProps}
        validateOn={validateOn}
        persist={true}
        validators={validators}
      />
    );
  }
}

export default SelectControl;
