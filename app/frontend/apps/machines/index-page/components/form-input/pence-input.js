import React from 'react';
import numeral from 'numeral';

export default class PenceInput extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      total: this.props.input.value * 10 / 100,
    }
  }

  penceInputChange = (value) => {
    this.props.input.onChange(value);

    this.setState(state => ({
      total: numeral(value * 10 / 100).format('0,0.00'),
    }));
  }

  render() {
    const {
      label,
      input: {
        value,
        onChange
      },
      meta: { touched, error, warning },
      input,
      type,
    } = this.props;

    const {
      total,
    } = this.state;

    return (
      <div className="boss-form__field">
        <label className="boss-form__label">
          <span className="boss-form__label-text">{label}</span>
          <span className="boss-form__units boss-form__units_size_extra">
            <input type={type} onChange={(e) => this.penceInputChange(e.target.value)} value={value} className={`boss-form__input ${touched && error && 'boss-form__input_state_error'}`}/>
            <span className="boss-form__units-value boss-form__units-value_position_last">x 10p</span>
          </span>
        </label>
        <p className="boss-form__field-note">£ {total}</p>
        {
          touched && error &&
            <div className="boss-form__error">
              <p className="boss-form__error-text">
                <span className="boss-form__error-line">{error}</span>
              </p>
            </div>
        }
      </div>
    )
  }
}
