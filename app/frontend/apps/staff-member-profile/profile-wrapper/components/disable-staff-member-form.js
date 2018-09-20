import React from 'react';
import { Field, reduxForm } from 'redux-form/immutable';
import BossFormCheckbox from '~/components/boss-form/boss-form-checkbox';
import BossFormTextarea from '~/components/boss-form/boss-form-textarea';

const validate = values => {
  const errors = {}

  if (!values.get('reason')) {
    errors.reason = "You must fill disable reason"
  }

  return errors;
}

export const DisableStaffMemberForm = ({onDisable, handleSubmit}) => {
  return (
    <div className="boss-modal-window__form">
      <form
        onSubmit={handleSubmit}
        className="boss-form"
      >
        <Field
          component={BossFormCheckbox}
          name="neverRehire"
          label="Do not rehire this person (Give reason below)"
        />
        <Field
          component={BossFormTextarea}
          required
          name="reason"
          label="Reason for disabling"
        />
        <div className="boss-form__field">
          <button
            type="submit"
            className="boss-button boss-button_role_block boss-form__submit"
          >
            Disable
          </button>
        </div>
      </form>
    </div>
  )
}

export default reduxForm({
  form: 'disable-staff-member-form',
  validate,
})(DisableStaffMemberForm);
