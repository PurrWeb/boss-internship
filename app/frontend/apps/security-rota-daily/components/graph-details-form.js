import React from 'react';
import { Field, Fields, reduxForm } from 'redux-form/immutable';
import StaffMemberInfo from './staff-member-info';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
  ErrorBlock,
  BossFormSelect,
  BossFormCheckbox,
} from '~/components/boss-form';
import BossFormShiftTimeInput from './boss-form-shift-time-input';
import {
  ColoredSingleOption,
  ColoredSingleValue,
} from '~/components/boss-form/colored-select';

class GraphDetailsForm extends React.Component {
  updateShift = (values, dispatch, props) => {
    return this.props.onSubmit(values, dispatch, props, 'update');
  };

  deleteShift = (values, dispatch, props) => {
    return this.props.onSubmit(values, dispatch, props, 'delete');
  };

  render() {
    const {
      handleSubmit,
      submittion,
      staffMember,
      staffType,
      rotaDate,
      submitting,
      error,
    } = this.props;

    return (
      <div>
        <div className="boss-modal-window__group">
          <StaffMemberInfo
            avatarUrl={staffMember.get('avatarUrl')}
            fullName={`${staffMember.get('firstName')} ${staffMember.get(
              'surname',
            )}`}
            staffType={staffType.get('name')}
            staffColor={staffType.get('color')}
          />
        </div>
        <div className="boss-modal-window__group">
          {error && <ErrorBlock error={error} />}
          <div className="boss-form">
            <Field
              name="venueId"
              component={BossFormSelect}
              options={this.props.venueTypes}
              clearable={false}
              optionValue="id"
              optionLabel="name"
              multy={false}
              placeholder="Select Venue"
              label="Venue"
              optionComponent={ColoredSingleOption}
              valueComponent={ColoredSingleValue}
            />
            <Fields
              names={['startsAt', 'endsAt']}
              component={BossFormShiftTimeInput}
              rotaDate={rotaDate}
            />
            <Field
              name="shiftType"
              label="Standby"
              type="checkbox"
              format={value => (value === 'standby' ? true : false)}
              normalize={value => (value ? 'standby' : 'normal')}
              component={BossFormCheckbox}
            />
            <div className="boss-form__field boss-form__field_role_controls">
              <button
                type="button"
                onClick={handleSubmit(this.updateShift)}
                disabled={submitting}
                className="boss-button boss-button_role_update boss-form__button_adjust_max boss-form__button_adjust_row"
              >
                Update
              </button>
              <button
                type="button"
                onClick={handleSubmit(this.deleteShift)}
                disabled={submitting}
                className="boss-button boss-button_role_delete boss-form__button_adjust_max"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        <div className="boss-modal-window__group">
          <p className="boss-modal-window__group-label">
            <span>Preferences</span>
          </p>
          <div className="boss-summary">
            <ul className="boss-summary__list">
              <li className="boss-summary__item boss-summary__item_layout_row boss-summary__item_role_header">
                <p className="boss-summary__text boss-summary__text_context_row">
                  Weekly Hours:
                </p>
                <p className="boss-summary__text boss-summary__text_marked">
                  {staffMember.get('preferredHours')}
                </p>
              </li>
              <li className="boss-summary__item boss-summary__item_layout_row">
                <p className="boss-summary__text boss-summary__text_context_row">
                  Day Preferences:
                </p>
                <p className="boss-summary__text boss-summary__text_marked">
                  {staffMember.get('preferredDays')}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

GraphDetailsForm.PropTypes = {
  staffMember: ImmutablePropTypes.map.isRequired,
  staffType: ImmutablePropTypes.map.isRequired,
  initialValues: PropTypes.object,
  rotaDate: PropTypes.string.isRequired,
  rotaStatus: PropTypes.string.isRequired,
  venueTypes: PropTypes.array.isRequired,
};

export default reduxForm({
  fields: ['shiftId', 'staffMemberId'],
  form: 'graph-details-form',
})(GraphDetailsForm);
