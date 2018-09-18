import React from 'react';
import PropTypes from 'prop-types';
import BossSelect from './boss-select';
import {
  ColoredSingleOption,
  ColoredMultipleValue,
} from '~/components/boss-form/colored-select';

class VenueSelect extends React.Component {
  onChange = values => {
    this.props.onChange(values.map(value => value.value));
  };

  render() {
    return (
      <BossSelect
        className={this.props.className}
        onChange={this.onChange}
        selected={this.props.selectedTypes}
        options={this.props.venueTypes}
        label="name"
        value="id"
        mappedProps={{
          multi: true,
          valueComponent: ColoredMultipleValue,
          optionComponent: ColoredSingleOption,
        }}
      />
    );
  }
}

VenueSelect.PropTypes = {
  onChange: PropTypes.func.isRequired,
  selectedTypes: PropTypes.array.isRequired,
  venueTypes: PropTypes.array.isRequired,
  className: PropTypes.string,
};

export default VenueSelect;
