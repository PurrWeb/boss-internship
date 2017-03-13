/// <reference path="../../../custom-typings/react-redux-form.d.ts" />

import * as React from 'react';
import * as Select from 'react-select';
import {Control, ModelAction, MapProps, WrapperProps, ValidateOn, Validators} from 'react-redux-form';
import SelectFixed from './react-select-fixed';
import {merge} from 'ramda';

import {setInputClass} from '../../../helpers/renderers';

interface Props {
  readonly model: string;
  readonly className?: string;
  readonly mapProps?: MapProps;
  readonly multi?: boolean;
  readonly options?: Select.Option[];
  readonly validateOn?: ValidateOn;
  readonly validators?: Validators;
}

interface State {
}

class SelectControl extends React.Component<Props, State> {
  localMapProps: MapProps;

  constructor(props: Props) {
    super(props);

    this.localMapProps = {
      className: setInputClass,
      options: () => this.props.options,
      value: (data: WrapperProps) => data.modelValue,
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
    const {className, model, multi, mapProps, validateOn, validators} = this.props;
    const mappedProps = merge(this.localMapProps, mapProps);

    return (
      <Control
        component={SelectFixed}
        className={className}
        model={model}
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
