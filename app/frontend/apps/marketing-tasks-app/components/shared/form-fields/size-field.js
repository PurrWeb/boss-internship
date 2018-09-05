import React from 'react';
import Select from 'react-select';


export default class SelectField extends React.Component {
  selectedValue() {
    if (typeof this.props.size.input.value == 'object' && 'toJSON' in this.props.size.input.value) {
      return this.props.size.input.value.toJS();
    } else {
      return this.props.size.input.value;
    }
  }

  render() {
    const {
      size,
      height_cm,
      width_cm,
      required,
      label,
      sizes
    } = this.props;

    let inputDisabled = true;

    if (size.input.value) {
      if (typeof size.input.value === 'object') {
        inputDisabled = size.input.value.value !== 'other';
      } else {
        inputDisabled = size.input.value !== 'other';
      }
    }

    return (
      <div className="boss-form__group boss-form__group_layout_half">
        <div className="boss-form__field">
          <p className="boss-form__label">
            <span className="boss-form__label-text">{ label }</span>
          </p>

          <div className="boss-form__select">
            <Select
              { ...size.input }
              options={ sizes }
              searchable={ false }
              clearable={ false }
              value={ this.selectedValue() }
            />

            {
              size.meta.touched && size.meta.error &&
                <div className="boss-form__error">
                  <p className="boss-form__error-text">
                    <span className="boss-form__error-line">{ size.meta.error }</span>
                  </p>
                </div>
            }
          </div>
        </div>

        <div className="boss-form__field">
          <div className="boss-form__size">
            <div className="boss-form__size-item">
              <label className="boss-form__label">
                <input
                  { ...height_cm.input }
                  type="number"
                  step="any"
                  placeholder="height"
                  className={ `boss-form__input ${height_cm.meta.touched && height_cm.meta.error && 'boss-form__input_state_error'}`}
                  disabled={ inputDisabled }
                />
              </label>

              {
                height_cm.meta.touched && height_cm.meta.error &&
                  <div className="boss-form__error">
                    <p className="boss-form__error-text">
                      <span className="boss-form__error-line">{ height_cm.meta.error }</span>
                    </p>
                  </div>
              }
            </div>

            <div className="boss-form__size-delimiter"></div>

            <div className="boss-form__size-item">
              <label className="boss-form__label">
                <input
                  { ...width_cm.input }
                  type="number"
                  step="any"
                  placeholder="height"
                  className={ `boss-form__input ${width_cm.meta.touched && width_cm.meta.error && 'boss-form__input_state_error'}`}
                  disabled={ inputDisabled }
                />
              </label>

              {
                width_cm.meta.touched && width_cm.meta.error &&
                  <div className="boss-form__error">
                    <p className="boss-form__error-text">
                      <span className="boss-form__error-line">{ width_cm.meta.error }</span>
                    </p>
                  </div>
              }
            </div>

            <div className="boss-form__size-units boss-form__size-units_space_before">
              cm
            </div>
          </div>
        </div>
      </div>
    )
  }
}
