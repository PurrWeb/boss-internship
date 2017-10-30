import React from 'react';

import BossSelect from './boss-select';
import {ColoredOption, ColoredValue} from '~/components/boss-form/colored-select';

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
        label="name"
        value="id"
        mappedProps={{
          multi: true,
          valueComponent: ColoredValue,
          optionComponent: ColoredOption
        }}
      />
    )
  }
}

export default StaffTypeSelect;
