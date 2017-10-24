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
  }

  static defaultProps = {
    className: ''
  }

  constructor(props) {
    super(props);
    this.state = {
      selected: props.selected ? this.getItemOption(props.selected) : "",
    }
  }
  
  getItemOption(option) {
    return {
        value: option[this.props.value || 'value'],
        label: option[this.props.label || 'label']
    };
  }

  getOptions(options) {
    return options.map(option => {
      return this.getItemOption(option);
    });
  }

  onChange = (newValue) => {
    if (Array.isArray(newValue) && !newValue.length) return;

    this.setState({
      selected: newValue,
    });

    this.props.onChange(newValue);
  }

  render() {
    return (
      <div className={`boss-form__select ${this.props.className}`}>
        <Select
          options={this.getOptions(this.props.options)}
          value={this.state.selected}
          onChange={this.onChange}
          {...this.props.mappedProps}
        />
      </div>
    )
  }
}

export default BossSelect;
