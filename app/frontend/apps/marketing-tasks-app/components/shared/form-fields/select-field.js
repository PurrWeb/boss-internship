import React from 'react';
import Select from 'react-select';


class SelectField extends React.Component {
  selectedValue() {
    if (typeof this.props.input.value == 'object' && 'toJSON' in this.props.input.value) {
      return this.props.input.value.toJS();
    } else {
      return this.props.input.value;
    }
  }

  render() {
    const {
      input,
      options,
      label,
      required,
      type,
      meta: { touched, error, warning },
    } = this.props;

    return (
      <span>
        <p className="boss-form__label">
          <span className="boss-form__label-text">{label}</span>
        </p>

        <div className="boss-form__select">
          <Select
            {...input}
            options={ options }
            searchable={ false }
            clearable={ false }
            value={ this.selectedValue() }
          />

          {
            touched && error &&
              <div className="boss-form__error">
                <p className="boss-form__error-text">
                  <span className="boss-form__error-line">{error}</span>
                </p>
              </div>
          }
        </div>
      </span>
    )
  }

}

export default SelectField;
