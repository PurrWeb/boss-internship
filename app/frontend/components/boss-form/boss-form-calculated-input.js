import React from "react";
import numeral from 'numeral';
import Cleave from 'cleave.js/react';

import Tooltip from '~/components/boss-form/tooltip';

export default class BossFormCalculatedInput extends React.Component {
  handleChange = (event) => {
    this.props.input.onChange(this.toCents(event.target.rawValue));
  }

  toCents(number) {
    return parseInt(number * 100);
  }

  render() {
    const {
      label,
      tooltip = '',
      calculatedCents = 0,
      disabled = false,
      unit = '£',
      input: { onBlur, value, onChange, name },
      meta: { touched, error, warning },
    } = this.props;
    let calculatedValue = '-';
    if (calculatedCents !== null) {
      calculatedValue = `${unit}${numeral(calculatedCents / 100).format('0,0.00')}`;
    }

    return(
      <div className="boss-form__field">
        <label className="boss-form__label">
          <span className="boss-form__label-text">
            {label}
            {tooltip && <Tooltip message={tooltip} />}
          </span>
          <span className="boss-form__field-note boss-form__field-note_position_above boss-form__field-note_size_extra">
            Calculated:
            <span className="boss-form__field-note-value"> {calculatedValue}</span>
          </span>
          <span className="boss-form__units">
            <span className="boss-form__units-value">{unit}</span>
            <Cleave
              disabled={disabled}
              className="boss-form__input"
              options={{numeral: true, numeralThousandsGroupStyle: 'thousand'}}
              onChange={this.handleChange} />
          </span>
        </label>
        {error && touched && <div className="boss-form__error">
          <p className="boss-form__error-text">
            <span className="boss-form__error-line">{error}</span>
          </p>
        </div>}
      </div>
    )
  }
}
