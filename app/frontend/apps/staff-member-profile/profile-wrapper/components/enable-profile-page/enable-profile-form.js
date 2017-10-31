import React from 'react';
import { Field, reduxForm, SubmissionError, formValueSelector, change } from 'redux-form/immutable';
import { connect } from 'react-redux';
import BossFormSelect from '~/components/boss-form/boss-form-select';
import BossFormInput from '~/components/boss-form/boss-form-input';
import BossFormCalendar from '~/components/boss-form/boss-form-calendar';
import BossFormEmployementStatus from '~/components/boss-form/boss-form-employement-status';
import BossFormAvatar from '~/components/boss-form/boss-form-avatar';

import {enableStaffMemberRequest} from '../../actions';
import {SECURITY_TYPE_ID} from '../../constants';
import notify from '~/components/global-notification';

const validate = values => {
  const errors = {}

  return errors;
}

function submission(values, dispatch) {
  return dispatch(enableStaffMemberRequest(values.toJS())).catch((resp) => {
    notify('Enabling Staff Member was Failed', {
      interval: 5000,
      status: 'error'
    });
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
          name="firstName"
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
          name="dateOfBirth"
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
        <Field
          component={BossFormSelect}
          name="mainVenue"
          disabled={isSecurityStaff}
          required
          label="Main Venue"
          optionLabel="name"
          optionValue="id"
          placeholder="Select main venue ..."
          options={venues}
        />
        <Field
          component={BossFormSelect}
          name="otherVenues"
          required
          multi
          label="Other Venues"
          optionLabel="name"
          optionValue="id"
          placeholder="Select other venues ..."
          options={venues}
        />
        <Field
          name="startsAt"
          component={BossFormCalendar}
          label="Start Date"
          required
        />

      </Panel>
      <Panel title="Address">
        <Field
          component={BossFormInput}
          required
          name="emailAddress"
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
          name="phoneNumber"
          type="text"
          label="Phone Number"
        />

      </Panel>      
      <Panel title="Work">
        <Field
          component={BossFormSelect}
          required
          name="staffType"
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
          name="nationalInsuranceNumber"
          type="text"
          label="National Insurance Number"
        />
        <Field
          component={BossFormInput}
          name="dayPreferenceNote"
          type="text"
          label="Day Preference"
        />

        <Field
          name="hoursPreferenceNote"
          component={BossFormInput}
          type="text"
          label="Hours Preference"
        />
        <Field
          component={BossFormSelect}
          required
          name="payRate"
          label="Pay Rate"
          optionLabel="name"
          optionValue="id"
          placeholder="Select pay rate ..."
          options={payRates}
        />
        <Field
          component={BossFormEmployementStatus}
          required
          name="employmentStatus"
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
  onChange: (values, dispatch, props) => {
    if(values.get('staffType') === SECURITY_TYPE_ID) {
      dispatch(change('enable-profile-form', 'mainVenue', null));
    } else {
      dispatch(change('enable-profile-form', 'mainVenue', values.get('mainVenue') || props.initialValues.get('mainVenue')));
    }
  },
})(EnableProfileForm);

const selector = formValueSelector('enable-profile-form');

const mapStateToProps = (state) => {
  return {
    isSecurityStaff: selector(state, 'staffType') === SECURITY_TYPE_ID,
  }
};

export default connect(mapStateToProps)(EnableProfileForm);
