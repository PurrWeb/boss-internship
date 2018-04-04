import React from 'react';
import {
  Field,
  Fields,
  reduxForm,
} from 'redux-form/immutable';
import StaffMemberInfo from './staff-member-info';

import {
  ErrorBlock,
  BossFormShiftTimeInput,
  BossFormCheckbox,
} from '~/components/boss-form';

class GraphDetailsForm extends React.Component {
  updateShift = (values, dispatch, props) => {
    return this.props.onSubmit(values, dispatch, props, 'update');
  }
  
  deleteShift = (values, dispatch, props) => {
    return this.props.onSubmit(values, dispatch, props, 'delete');
  }
  
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
            avatarUrl={staffMember.get('avatar_url')}
            fullName={`${staffMember.get('first_name')} ${staffMember.get('surname')}`}
            staffType={staffType.get('name')}
            staffColor={staffType.get('color')}
          />
        </div>
        <div className="boss-modal-window__group">
          {error && <ErrorBlock error={error} />}
          <div className="boss-form">
            <Fields
              names={['starts_at', 'ends_at']}
              component={BossFormShiftTimeInput}
              rotaDate={rotaDate}
            />
            <Field
              name="shift_type"
              label="Standby"
              type="checkbox"
              format={(value) => value === 'standby' ? true : false}
              normalize={(value) => value ? 'standby' : 'normal'}
              component={BossFormCheckbox}
            />
            <div className="boss-form__field boss-form__field_role_controls">
              <button
                type="button"
                onClick={handleSubmit(this.updateShift)}
                disabled={submitting}
                className="boss-button boss-button_role_update boss-form__button_adjust_max boss-form__button_adjust_row"
              >Update</button>
              <button
                type="button"
                onClick={handleSubmit(this.deleteShift)}
                disabled={submitting}
                className="boss-button boss-button_role_delete boss-form__button_adjust_max"
              >Delete</button>
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
                  {staffMember.get('preferred_hours')}
                </p>
              </li>
              <li className="boss-summary__item boss-summary__item_layout_row">
                <p className="boss-summary__text boss-summary__text_context_row">
                  Day Preferences:
                </p>
                <p className="boss-summary__text boss-summary__text_marked">
                  {staffMember.get('preferred_days')}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default reduxForm({
  fields: ['shift_id', 'staff_member_id'],
  form: 'graph-details-form',
})(GraphDetailsForm);
