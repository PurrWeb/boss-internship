import React from 'react';
import Select from 'react-select';

class AssignToUserField extends React.Component {
  renderOption(option) {
    return (
      <span className="Select-staff-member">
        <span className="Select-staff-member-info">
          <span className="Select-staff-member-name">{ option.value }</span>
        </span>
      </span>
    );
  }

  selectedValue() {
    if (typeof this.props.assign_to_user.input.value == 'object' && 'toJSON' in this.props.assign_to_user.input.value) {
      return this.props.assign_to_user.input.value.toJS();
    } else {
      return this.props.assign_to_user.input.value;
    }
  }

  render() {
    const {
      assign_to_user,
      assign_to_self,
      required,
      label,
      marketingUsers
    } = this.props;

    return (
      <div className="boss-form__field">
        <label className="boss-form__checkbox-label boss-form__checkbox-label_context_field">
          <input
            { ...assign_to_self.input }
            type="checkbox"
            className="boss-form__checkbox-input"
            checked={ assign_to_self.input.value }
          />
          <span className="boss-form__checkbox-label-text">Assign to myself</span>
        </label>

        <div className="boss-form__select boss-form__select_role_staff-member">
          <Select
            {...assign_to_user.input}
            options={ marketingUsers }
            searchable={ false }
            clearable={ false }
            value={ this.selectedValue() }
            disabled={ !!assign_to_self.input.value }
            optionRenderer={ this.renderOption.bind(this) }
            valueRenderer={ this.renderOption.bind(this) }
          />

          {
            assign_to_user.meta.touched && assign_to_user.meta.error &&
              <div className="boss-form__error">
                <p className="boss-form__error-text">
                  <span className="boss-form__error-line">{assign_to_user.meta.error}</span>
                </p>
              </div>
          }
        </div>
      </div>
    )
  }
}

export default AssignToUserField;
