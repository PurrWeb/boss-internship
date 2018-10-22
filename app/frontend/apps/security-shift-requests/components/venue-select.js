import React from 'react';
import PropTypes from 'prop-types';
import BossSelect from './boss-select';
import { ColoredSingleOption, ColoredSingleValue } from '~/components/boss-form/colored-select';

class VenueSelect extends React.Component {
  render() {
    const { selected, venues, label, clearable } = this.props;
    return (
      <div>
        {label && (
          <label className="boss-form__label">
            <span className="boss-form__label-text">{this.props.label}</span>
          </label>
        )}
        <BossSelect
          className={this.props.className}
          onChange={this.props.onChange}
          selected={selected}
          options={venues}
          clearable={clearable}
          mappedProps={{
            multi: false,
            valueComponent: ColoredSingleValue,
            optionComponent: ColoredSingleOption,
          }}
        />
      </div>
    );
  }
}

VenueSelect.PropTypes = {
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.array.isRequired,
  venues: PropTypes.array.isRequired,
  className: PropTypes.string,
};

export default VenueSelect;
