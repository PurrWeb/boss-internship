import React from 'react';
import PropTypes from 'prop-types';
import VenueSelect from './venue-select';

class VenueSelectFormField extends React.Component {
  onChange = value => {
    this.props.input.onChange(value);
  };

  render() {
    const { input: { value }, venues, clearable, label } = this.props;
    return (
      <VenueSelect selected={value} venues={venues} label={label} clearable={clearable} onChange={this.onChange} />
    );
  }
}

VenueSelectFormField.PropTypes = {
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.array.isRequired,
  venues: PropTypes.array.isRequired,
  className: PropTypes.string,
};

export default VenueSelectFormField;
