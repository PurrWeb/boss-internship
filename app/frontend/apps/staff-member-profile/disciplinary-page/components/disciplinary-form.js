import React from 'react';
import { Field, reduxForm } from 'redux-form/immutable';
import * as constants from '../constants';
import { BossFormInput, BossFormTextarea, BossFormSelect } from '~/components/boss-form';

const options = Object.keys(constants.DISCIPLINARY_LEVELS_MAP).map(levelName => ({
  value: constants.DISCIPLINARY_LEVELS_MAP[levelName],
  label: levelName,
}));

class DisciplinaryForm extends React.Component {
  renderError(error) {
    return (
      <div className="boss-modal-window__alert">
        <div className="boss-alert boss-alert_role_area boss-alert_context_above">
          <p className="boss-alert__text">{error}</p>
        </div>
      </div>
    );
  }
  render() {
    const { error } = this.props;
    return (
      <div>
        {error && this.renderError(error)}
        <form onSubmit={this.props.handleSubmit} className="boss-modal-window__form boss-form">
          <div className="boss-form__row">
            <Field name="title" label="Title" component={BossFormInput} fieldClassName="boss-form__field_layout_max" />
            <Field
              name="level"
              label="Level"
              component={BossFormSelect}
              options={options}
              clearable={false}
              multy={false}
              fieldClassName="boss-form__field_layout_third"
            />
          </div>

          <Field
            name="note"
            label="Note"
            component={BossFormTextarea}
            placeholder=" "
            note="Note: This text will be the official correspondence of this warning sent to the Staff Member."
          />
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

DisciplinaryForm.propTypes = {};

export default reduxForm({
  form: 'disciplinary-form',
})(DisciplinaryForm);
