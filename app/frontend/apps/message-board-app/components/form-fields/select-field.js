import React from "react";
import Select from "react-select";

class SelectField extends React.Component {
  selectedValue() {
    if (Object.prototype.toString.call( this.props.venueIds.input.value ) === "[object Object]") {
      return this.props.venueIds.input.value.toJS();
    } else {
      return this.props.venueIds.input.value;
    }
  }

  render() {
    const {
      venueIds,
      toAllVenues,
      options,
      label,
      required,
    } = this.props;

    return (
      <div className="boss-form__row">
        <div className="boss-form__field boss-form__field_role_label-small boss-form__field_position_last">
          <p className="boss-form__label">
            <span className="boss-form__label-text boss-form__label-text_type_inline-fluid">{label}</span>
          </p>
        </div>

        <div className="boss-form__field boss-form__field_layout_max">
          <div className="boss-form__select">
            <Select
              {...venueIds.input}
              multi={true}
              name={venueIds.name}
              options={options}
              value={ this.selectedValue() }
              onChange={(value) => venueIds.input.onChange(value)}
              onBlur={(value) => venueIds.input.onBlur(value)}
              searchable={ false }
              clearable={ true }
              disabled={ !!toAllVenues.input.value }
            />

            {
              venueIds.meta.touched && venueIds.meta.error &&
                <div className="boss-form__error">
                  <p className="boss-form__error-text">
                    <span className="boss-form__error-line">{venueIds.meta.error}</span>
                  </p>
                </div>
            }
          </div>
        </div>

        <div className="boss-form__field boss-form__field_layout_min">
          <label className="boss-form__checkbox-label">
          <input
            { ...toAllVenues.input}
            type="checkbox"
            checked={ toAllVenues.input.value }
            className="boss-form__checkbox-input"
          />
            <span className="boss-form__checkbox-label-text">Select All</span>
          </label>
        </div>
      </div>
    )
  }

}

export default SelectField;
