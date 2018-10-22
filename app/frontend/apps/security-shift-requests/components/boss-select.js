import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import _ from 'lodash';

class BossSelect extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    mappedProps: PropTypes.object,
    multi: PropTypes.bool,
  };

  render() {
    const { options, mappedProps, multi, className, clearable } = this.props;

    return (
      <div className={`boss-form__select ${className && className}`}>
        <Select
          options={options}
          value={this.props.selected}
          onChange={this.props.onChange}
          clearable={clearable}
          simpleValue
          valueKey="id"
          labelKey="name"
          multi
          {...mappedProps}
        />
      </div>
    );
  }
}

export default BossSelect;
