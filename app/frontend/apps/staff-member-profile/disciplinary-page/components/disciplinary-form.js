import React from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable';
import { connect } from 'react-redux';
import oFetch from 'o-fetch';
import * as constants from '../constants';
import { BossFormInput, BossFormTextarea, BossFormSelect, BossFormCalendar } from '~/components/boss-form';

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
    const [
      staffMemberFullName,
      warningOptions,
      warningMessage,
      warningLimit,
      companyName,
      appealToName,
      currentUserFullName,
    ] = oFetch(
      this.props,
      'staffMemberFullName',
      'warningOptions',
      'warningMessage',
      'warningLimit',
      'companyName',
      'appealToName',
      'currentUserFullName',
    );

    return (
      <div className="boss-modal-window__form">
        {error && this.renderError(error)}
        <form onSubmit={this.props.handleSubmit} className="boss-form boss-form_role_disciplinary">
          <div className="boss-form__row boss-form__row_justify_center">
            <div className="boss-form__text-part">
              <div className="boss-form__value boss-form__value_type_inline boss-form__input_type_extra boss-form__input_justify_center">
                {companyName}
              </div>
            </div>
          </div>
          <div className="boss-form__row boss-form__row_justify_center">
            <Field
              name="level"
              label="Notice of"
              component={BossFormSelect}
              options={warningOptions}
              clearable={false}
              multy={false}
              fieldClassName="boss-form__field_layout_half boss-form__field_role_control"
              labelClassNames="boss-form__label_type_light boss-form__label_type_narrow"
              selectClassNames="boss-form__select_type_narrow"
            />
          </div>
          <div className="boss-form__group">
            <div className="boss-form__text">
              <div className="boss-form__text-line">
                Dear <span className="boss-form__text-primary boss-form__text-large">{staffMemberFullName}</span>
              </div>
              <div className="boss-form__text-line">
                You attend a disciplinary hearing on{' '}
                <div className="boss-form__text-part">
                  <div className="boss-form__value boss-form__value_type_inline boss-form__value_size_min">
                    {`< send time >`}
                  </div>
                </div>
                , and I am writing to inform you of your
                <div className="boss-form__text-part">
                  <Field
                    name="title"
                    placeholder="title"
                    component={BossFormInput}
                    inputClassName="boss-form__input_type_inline boss-form__input_size_min"
                  />
                </div>
                . This warning will be placed in your personal file but will be disregarded for disciplinary purposes
                after a period of{' '}
                <div className="boss-form__text-part">
                  <div className="boss-form__value boss-form__value_type_inline boss-form__value_size_min">
                    {warningLimit}
                  </div>
                </div>
                , provided your conduct improves.
              </div>
            </div>
          </div>
          <Field
            name="nature"
            label="a) The nature of the unsatisfactory conduct or performance was"
            component={BossFormTextarea}
            labelClassNames="boss-form__label-text_type_marked"
            placeholder=" "
          />
          <Field
            name="conduct"
            label="b) The conduct or performance improvement expected is"
            component={BossFormTextarea}
            labelClassNames="boss-form__label-text_type_marked"
            placeholder=" "
          />
          <Field
            name="consequence"
            label="c) The likely consequence of further misconduct or insufficient improvement is"
            component={BossFormTextarea}
            labelClassNames="boss-form__label-text_type_marked"
            placeholder=" "
            note="Note: This text will be the official correspondence of this warning sent to the Staff Member."
          />
          <div className="boss-form__group">
            <div className="boss-form__text">
              <div className="boss-form__text-line">
                You have the right of appeal against this decision to{' '}
                <div className="boss-form__text-part">
                  <div className="boss-form__value boss-form__value_type_inline boss-form__value_size_min">
                    {appealToName}
                  </div>
                </div>{' '}
                within 7 days of receiving this disciplinary decision.
              </div>
            </div>
          </div>
          <div className="boss-form__group">
            <div className="boss-form__text">
              <div className="boss-form__text-line">
                {currentUserFullName} (on behalf of {companyName})
              </div>
            </div>
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

const DisciplinaryFormComponent = reduxForm({
  form: 'disciplinary-form',
})(DisciplinaryForm);
const selector = formValueSelector('disciplinary-form');

export default connect((state, ownProps) => {
  const level = selector(state, 'level');
  if (level) {
    console.log(level);
    const warnings = oFetch(ownProps, 'warnings');
    console.log(warnings);
    const warningLimits = oFetch(ownProps, 'warningLimits');
    console.log(warningLimits);
    const warningMessage = warnings[level];
    const warningLimit = warningLimits[level];
    return {
      warningMessage,
      warningLimit,
    };
  } else {
    return {
      warningMessage: null,
      warningLimit: null,
    };
  }
})(DisciplinaryFormComponent);
