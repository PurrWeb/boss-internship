import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import _ from 'lodash';

class BossSelect extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    mappedProps: PropTypes.object,
    value: PropTypes.string,
    label: PropTypes.string,
    multi: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: [],
    };
  }

  getItemOption(option) {
    return {
      value: option[this.props.value || 'value'],
      label: option[this.props.label || 'label'],
      color: option['color'],
    };
  }

  getOptions(options) {
    return options.map(option => {
      return this.getItemOption(option);
    });
  }

  renderValue = option => {
    return (
      <span style={{ backgroundColor: option.color }}>{option.label}</span>
    );
  };

  onChange = newValue => {
    this.setState({
      selected: newValue,
    });

    this.props.onChange(newValue);
  };

  render() {
    const { options, mappedProps, multi, className } = this.props;

    return (
      <div className={`boss-form__select ${className && className}`}>
        <Select
          options={this.getOptions(options)}
          value={this.props.selected}
          onChange={this.onChange}
          multi
          {...mappedProps}
        />
      </div>
    );
  }
}

export default BossSelect;
