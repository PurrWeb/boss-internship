import React from 'react';
import { Field, reduxForm } from 'redux-form/immutable';
import BossFormCalendar from '~/components/boss-form/boss-form-calendar';

class EditAccessoryRequestForm extends React.Component {
  render() {
    return (
      <form onSubmit={this.props.handleSubmit} className="boss-modal-window__form boss-form">
        <div className="boss-form__field">
          <Field name="payslipDate" component={BossFormCalendar} label="Payslip date" required />
        </div>

        <div className="boss-form__field">
          <button
            disabled={this.props.submitting}
            className={`boss-button boss-form__submit ${this.props.buttonClass}`}
          >
            {this.props.buttonText}
          </button>
        </div>
      </form>
    );
  }
}

EditAccessoryRequestForm.propTypes = {};

EditAccessoryRequestForm.defaultProps = {
  buttonClass: '',
  buttonText: 'Update',
};

export default reduxForm({
  form: 'edit-accessory-request-form',
})(EditAccessoryRequestForm);
