import React from 'react';
import {
  Field,
  Fields,
  reduxForm,
} from 'redux-form/immutable';

import {
  ErrorBlock,
  BossFormShiftTimeInput,
  BossFormCheckbox,
} from '~/components/boss-form';

class AddShiftForm extends React.Component {
  render() {
    const {
      handleSubmit,
      submittion,
      staffMember,
      staffType,
      rotaDate,
      submitting,
      error,
      handleAfterAdd,
    } = this.props;

    return (
      <form onSubmit={handleSubmit(submittion)} className="boss-form">
        {error && <ErrorBlock error={error} />}
        <Fields
          names={['starts_at', 'ends_at']}
          component={BossFormShiftTimeInput}
          rotaDate={rotaDate}
        />
        <Field
          name="shift_type"
          label="Standby"
          type="checkbox"
          format={(value) => value === 'standby' ? true : false}
          normalize={(value) => value ? 'standby' : 'normal'}
          component={BossFormCheckbox}
        />
        <div className="boss-form__field boss-form__field_role_controls">
          <button
            type="button"
            onClick={handleAfterAdd}
            className="boss-button boss-button_role_inactive boss-form__button_adjust_max boss-form__button_adjust_row"
          >Cancel</button>
          <button
            type="submit"
            disabled={submitting}
            className="boss-button boss-button_role_add boss-form__button_adjust_max"
          >Add Shift Hours</button>
        </div>
      </form>
    )
  }
}

export default reduxForm({
  fields: ['staff_member_id'],
  form: 'add-shift-form',
})(AddShiftForm);
