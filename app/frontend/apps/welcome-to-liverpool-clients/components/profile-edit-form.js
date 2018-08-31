import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form/immutable';
import BossFormInput from '~/components/boss-form/boss-form-input';
import BossFormCalendar from '~/components/boss-form/boss-form-calendar';
import BossFormSelect from '~/components/boss-form/boss-form-select';

const onSubmit = (values, dispatch, props) => {
  return props.onFormSubmit(values.toJS(), dispatch).catch(resp => {
    const errors = resp.response.data.errors;
    if (errors) {
      let base = {};

      if (errors.base) {
        base = {
          _error: errors.base,
        };
      }
      throw new SubmissionError({ ...errors, ...base });
    }
    return resp;
  });
};

const genderOptions = [
  {
    value: 'male',
    label: 'Male',
  },
  {
    value: 'female',
    label: 'Female',
  },
  {
    value: 'other',
    label: 'Other',
  },
];

const universityOptions = [
  {
    value: 'The University of Liverpool',
    label: 'The University of Liverpool',
  },
];

class ProfileEditForm extends React.Component {
  render() {
    const { submitting, handleSubmit } = this.props;
    return (
      <div className="boss-page-main__group boss-page-main__group_adjust_wtl-eсp-form">
        <form onSubmit={handleSubmit} className="toss-form">
          <Field name="firstName" component={BossFormInput} label="First Name" placeholder="First Name" />
          <Field name="surname" component={BossFormInput} label="Surname" placeholder="Surname" />
          <Field
            name="gender"
            options={genderOptions}
            component={BossFormSelect}
            label="Gender"
            placeholder="Select Gender"
          />
          <Field name="dateOfBirth" label="Date of Birth" placeholder="Select Date" component={BossFormCalendar} />
          <Field name="email" type="email" component={BossFormInput} label="Email" placeholder="Email address" />
          <Field
            name="university"
            options={universityOptions}
            component={BossFormSelect}
            label="University"
            placeholder="Select University"
          />
          <Field
            name="cardNumber"
            type="number"
            component={BossFormInput}
            label="Card Number"
            placeholder="Card Number"
          />
          <div className="boss-form__field boss-form__field_justify_center">
            <button disabled={submitting} className="boss-button boss-form__submit" type="submit">
              Update
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default reduxForm({
  onSubmit: onSubmit,
  form: 'profile-edit-form',
})(ProfileEditForm);
