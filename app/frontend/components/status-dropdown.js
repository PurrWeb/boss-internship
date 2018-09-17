import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Select from 'react-select';

const rotaedOrActiveOption = 'Rotaed / Active Only';
const allOption = 'All';
const statusOptions = [
  {
    label: rotaedOrActiveOption,
    value: rotaedOrActiveOption,
  },
  {
    label: allOption,
    value: allOption,
  },
];
export default class StatusDropdown extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  };
  render() {
    return (
      <div className="boss-form__select">
        <Select
          value={this.props.value}
          options={statusOptions}
          onChange={this.props.onChange}
          simpleValue
          clearable={false}
        />
      </div>
    );
  }
}
