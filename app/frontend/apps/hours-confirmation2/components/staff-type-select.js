import React from 'react';

import BossSelect from './boss-select';
import {ColoredSingleOption, ColoredMultipleValue} from '~/components/boss-form/colored-select';

class StaffTypeSelect extends React.Component {
  
  onChange = (values) => {
    this.props.onChange(values.map(value => value.value));
  }

  render() {
    return (
      <BossSelect
        onChange={this.onChange}
        selected={this.props.selectedTypes}
        options={this.props.staffTypes}
        label={this.props.label || "name"}
        value={this.props.value || "id"}
        mappedProps={{
          multi: true,
          valueComponent: ColoredMultipleValue,
          optionComponent: ColoredSingleOption
        }}
      />
    )
  }
}

export default StaffTypeSelect;
