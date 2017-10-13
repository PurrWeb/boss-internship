import React from 'react';
import { Field, reduxForm } from 'redux-form/immutable';

import BossInput from '~/components/boss-form/boss-form-input';

class EditMachineForm extends React.Component {
  render() {
    const {
      handleSubmit,
      submitting,
    } = this.props;

    return (
      <div className="boss-modal-window__form">
        <form onSubmit={handleSubmit} className="boss-form">
          <Field
            name="name"
            label="Name"
            component={BossInput}
          />
          <Field
            name="location"
            label="Location"
            component={BossInput}
          />
          <div className="boss-form__field">
            <button
              disabled={submitting}
              type="submit"
              className="boss-button boss-form__submit"
            >Update</button>
          </div>
        </form>
      </div>
    )
  }
}

export default reduxForm({
  fields: ['id'],
  form: 'edit-machine-form',
})(EditMachineForm);
