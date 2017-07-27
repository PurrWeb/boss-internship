import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

class CheckListsSelect extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      options: props.options,
      selected: ""
    }
  }

  onChange = (newValue) => {
    this.setState({
      selected: newValue,
    });

    this.props.onChange(newValue);
  }

  render() {
    return (
      <div className="boss-form__select">
        <Select
          options={this.state.options}
          value={this.state.selected}
          onChange={this.onChange}
          placeholder="Select check list ..."
        />
      </div>
    )
  }
}

export default CheckListsSelect;
