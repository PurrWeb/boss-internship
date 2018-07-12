import React from 'react';
import { Field, reduxForm } from 'redux-form/immutable';

import { BossFormInput } from '~/components/boss-form';

class EditFreeItemsForm extends React.Component {

  renderBaseError(error) {
    return (
      <div className="boss-alert boss-alert_role_area boss-alert_context_above">
        <p className="boss-alert__text">{error}</p>
      </div>
    );
  }

  render() {
    const { error } = this.props;
    return (
      <div>
        {error && this.renderBaseError(error)}
        <form onSubmit={this.props.handleSubmit} className="boss-modal-window__form">
          <Field name="freeItemsCount" label="Free Items" component={BossFormInput} />
          <div className="boss-form__field">
            <button 
              type="button" 
              onClick={this.props.onOpenHistory} 
              className="boss-form__link boss-form__link_role_history"
            >
              History
            </button>
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
      </div>
    );
  }
}

EditFreeItemsForm.propTypes = {};

EditFreeItemsForm.defaultProps = {
  buttonClass: '',
  buttonText: 'Update',
};

EditFreeItemsForm = reduxForm({
  values: ['id'],
  form: 'edit-free-items-form',
})(EditFreeItemsForm);

export default EditFreeItemsForm;
