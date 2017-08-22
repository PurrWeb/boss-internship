import React from 'react';
import { Field, reduxForm, SubmissionError, formValueSelector } from 'redux-form/immutable';
import { connect } from 'react-redux';
import BossFormSelect from '~/components/boss-form/boss-form-select';
import BossFormInput from '~/components/boss-form/boss-form-input';
import BossFormCalendar from '~/components/boss-form/boss-form-calendar';
import BossFormEmployementStatus from '~/components/boss-form/boss-form-employement-status';
import BossFormAvatar from '~/components/boss-form/boss-form-avatar';

import {enableStaffMemberRequest} from '../../actions';
import {SECURITY_TYPE_ID} from '../../constants';

const validate = values => {
  const errors = {}

  return errors;
}

function submission(values, dispatch) {
  return dispatch(enableStaffMemberRequest(values.toJS())).catch((resp) => {
    const errors = resp.response.data.errors;
    if (errors) {
      window.scrollTo(0, 0);
      throw new SubmissionError(errors);
    }
  });
}
const Panel = ({title, children}) => {

  return (
    <div className="boss-board boss-board_context_stack boss-board_role_panel">
      <div className="boss-board__header">
        <h2 className="boss-board__title">
          {title}
        </h2>
      </div>
      <div className="boss-board__main">
        <div className="boss-board__manager">
          {children}
        </div>
      </div>
    </div>    
  )
}

let EnableProfileForm = ({
    handleSubmit,
    submitting,
    genderValues,
    staffTypes,
    payRates,
    venues,
    isSecurityStaff,
  }) => {

  const renderSecurityStaffFields = () => {
    return [<Field
      key={'sia_badge_number'}
      name="sia_badge_number"
      component={BossFormInput}
      type="text"
      label="SIA badge number"
    />,
    <Field
      key={'sia_badge_expiry_date'}
      component={BossFormCalendar}
      required
      name="sia_badge_expiry_date"
      label="SIA badge expiry date"
    />]
  }

  return (
    <form
      onSubmit={handleSubmit(submission)}
      className="boss-form boss-page-main__inner_space_large boss-page-main__inner_opaque"
    >
      <Panel title="Basic Information">
        <Field
          component={BossFormInput}
          required
          name="first_name"
          type="text"
          label="First Name"
        />
        <Field
          component={BossFormInput}
          required
          name="surname"
          type="text"
          label="Surname"
        />
        <Field
          component={BossFormSelect}
          name="gender"
          required
          label="Gender"
          placeholder="Select gender ..."
          options={genderValues.toJS()}
        />
        <Field
          name="date_of_birth"
          component={BossFormCalendar}
          label="Date of birth"
          required
        />
      </Panel>
      <Panel title="Photo">
        <Field
          name="avatar"
          component={BossFormAvatar}
        />
      </Panel>
      <Panel title="Venue">
        { !isSecurityStaff && <Field
          component={BossFormSelect}
          name="master_venue"
          required
          label="Main Venue"
          optionLabel="name"
          optionValue="id"
          placeholder="Select main venue ..."
          options={venues.toJS()}
        />}
        <Field
          component={BossFormSelect}
          name="other_venues"
          required
          multi
          label="Other Venues"
          optionLabel="name"
          optionValue="id"
          placeholder="Select other venues ..."
          options={venues.toJS()}
        />
        <Field
          name="starts_at"
          component={BossFormCalendar}
          label="Start Date"
          required
        />

      </Panel>
      <Panel title="Address">
        <Field
          component={BossFormInput}
          required
          name="email_address"
          type="text"
          label="Email"
        />
        <Field
          component={BossFormInput}
          required
          name="address"
          type="text"
          label="Address"
        />
        <Field
          component={BossFormInput}
          required
          name="country"
          type="text"
          label="Country"
        />
        <Field
          component={BossFormInput}
          required
          name="county"
          type="text"
          label="County"
        />
        <Field
          component={BossFormInput}
          required
          name="postcode"
          type="text"
          label="Post Code"
        />

        <Field
          component={BossFormInput}
          required
          name="phone_number"
          type="text"
          label="Phone Number"
        />

      </Panel>      
      <Panel title="Work">
        <Field
          component={BossFormSelect}
          required
          name="staff_type"
          label="Staff Type"
          optionLabel="name"
          optionValue="id"
          placeholder="Select staff type ..."
          options={staffTypes.toJS()}
        />
        { isSecurityStaff && renderSecurityStaffFields() }
        <Field
          component={BossFormInput}
          name="pinCode"
          type="text"
          label="Pin Code"
        />
        <Field
          component={BossFormInput}
          required
          name="national_insurance_number"
          type="text"
          label="National Insurance Number"
        />
        <Field
          component={BossFormInput}
          name="day_preference"
          type="text"
          label="Day Preference"
        />

        <Field
          name="hours_preference"
          component={BossFormInput}
          type="text"
          label="Hours Preference"
        />
        <Field
          component={BossFormSelect}
          required
          name="pay_rate"
          label="Pay Rate"
          optionLabel="name"
          optionValue="id"
          placeholder="Select pay rate ..."
          options={payRates.toJS()}
        />
        <Field
          component={BossFormEmployementStatus}
          required
          name="status_statement"
          label="Starter Employement Status Statement"
        />
      </Panel>      

      <div className="boss-form__field boss-form__field_justify_center">
        <button
          className="boss-button boss-button_role_submit"
          type="submit"
          disabled={submitting}
        >Submit</button>
      </div>
    </form>
  )
}

EnableProfileForm = reduxForm({
  form: 'enable-profile-form',
  validate,
})(EnableProfileForm);

const selector = formValueSelector('enable-profile-form');

const mapStateToProps = (state) => {
  return {
    isSecurityStaff: selector(state, 'staff_type') === SECURITY_TYPE_ID,
  }
};

export default connect(mapStateToProps)(EnableProfileForm);
