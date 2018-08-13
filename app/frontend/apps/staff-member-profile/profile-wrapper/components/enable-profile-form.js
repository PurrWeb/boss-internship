import React from 'react';
import { Field, reduxForm } from 'redux-form/immutable';

import BossFormCalendar from '~/components/boss-form/boss-form-calendar';

class EnableProfileForm extends React.Component {
  renderBaseError = error => {
    return (
      <div className="boss-alert boss-alert_role_area boss-alert_context_above">
        <p className="boss-alert__text">{error}</p>
      </div>
    );
  };

  render() {
    const { error, submitting } = this.props;
    return (
      <div>
        {error && this.renderBaseError(error)}
        <form onSubmit={this.props.handleSubmit} className="boss-modal-window__form boss-form">
          <div className="boss-form__group">
            <h3 className="boss-form__group-title">Please enter new start date</h3>
            <Field name="startsAt" component={BossFormCalendar} label="" />
          </div>
          <div className="boss-form__field">
            <button disabled={submitting} className={`boss-button boss-form__submit ${this.props.buttonClass}`}>
              {this.props.buttonText}
            </button>
          </div>
        </form>
      </div>
    );
  }
}

EnableProfileForm.propTypes = {};

EnableProfileForm.defaultProps = {
  buttonClass: 'boss-button_role_confirm',
  buttonText: 'Enable',
};

export default reduxForm({
  form: 'enable-profile-form',
  validate: values => (values.get('startsAt') ? {} : { startsAt: `Start date must be not empty` }),
})(EnableProfileForm);
