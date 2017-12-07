import React from 'react';
import { Field, reduxForm } from 'redux-form';
import {
  BossFormSelect,
  BossFormTextarea,
  BossFormCalendar,
  BossFormStaffmemberSelect,
} from '~/components/boss-form';

import {
  ImageOption,
  ImageValue,
} from '~/components/boss-form/colored-select';

export const HOLIDAY_TYPES = [
  {
    label: 'Paid holiday',
    value: 'paid_holiday',
  },
  {
    label: 'Unpaid holiday',
    value: 'unpaid_holiday',
  },
  {
    label: 'Sick leave',
    value: 'sick_leave',
  },
]

class HolidayForm extends React.PureComponent {
  renderBaseError(errors) {
    return (
      <div className="boss-modal-window__alert">
        <div className="boss-alert boss-alert_role_area boss-alert_context_above">
          {errors.map((error, index) => <p key={index} className="boss-alert__text">{error}</p>)}
        </div>
      </div>
    )
  }
  
  render() {
    return(
      <form
        className="boss-form"
        onSubmit={this.props.handleSubmit}
      >
        {this.props.error && this.renderBaseError(this.props.error)}
        <div className="boss-form__field boss-form__select_role_staff-member">
          <Field
            component={BossFormStaffmemberSelect}
            name="staffMember"
            required
            venueId={this.props.venueId}
            label="Staff member"
            clearable={false}
            normalizeLabel={(option) => `${option.first_name} ${option.surname}`}
            optionValue="id"
            extraOption={(option) => ({image: option.avatar_url})}
            placeholder="Select staff member ..."
            valueComponent={ImageValue}
            optionComponent={ImageOption}
          />
        </div>
        <div className="boss-form__row">
          <div className="boss-form__field boss-form__field_layout_third">
            <Field
              name="startDate"
              component={BossFormCalendar}
              label="Starts at"
              required
            />
          </div>
          <div className="boss-form__field boss-form__field_layout_third">
            <Field
              name="endDate"
              component={BossFormCalendar}
              label="Ends at"
              required
            />
          </div>
          <div className="boss-form__field boss-form__field_layout_third">
            <Field
              component={BossFormSelect}
              name="holidayType"
              required
              label="Holiday Type"
              optionLabel="label"
              optionValue="value"
              placeholder="Select holiday type ..."
              options={HOLIDAY_TYPES}
            />
          </div>
        </div>
          <Field
          component={BossFormTextarea}
          name="note"
          label="Note"
        />
        <div className="boss-form__field">
          <button type="submit"
            disabled={this.props.submitting}
            className="boss-button boss-button_role_add boss-form__submit"
          >Add Holiday</button>
        </div>
      </form>
    )
  }
}

export default reduxForm({
  form: 'holiday-form',
})(HolidayForm);
