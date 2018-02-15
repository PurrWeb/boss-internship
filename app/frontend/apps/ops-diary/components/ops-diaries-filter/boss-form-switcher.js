import React, { Component } from 'react';
import { RadioGroup, Radio } from 'react-radio-group';

class BossFormSwitcher extends Component {
  _renderSwitcherData() {
    return this.props.data.map((item, key) => {
      return (
        <label key={key.toString()} className="boss-form__switcher-label">
          <Radio value={item.value} className="boss-form__switcher-radio" />
          <span className="boss-form__switcher-label-text">{item.label}</span>
        </label>
      );
    });
  }

  _handleChange = value => {
    this.props.input.onChange(value);
  };

  render() {
    return (
      <RadioGroup
        name="filter"
        selectedValue={this.props.input.value}
        onChange={this._handleChange}
        className="boss-form__switcher"
      >
        {this._renderSwitcherData()}
      </RadioGroup>
    );
  }
}

export default BossFormSwitcher;
