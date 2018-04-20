import React from 'react';
import oFetch from 'o-fetch';

export const DisableStaffMemberModalContent = ({onDisable}) => {
  return (
    <div className="boss-form">
      <div className="boss-form__field">
        <label className="boss-form__checkbox-label">
          <input type="checkbox" className="boss-form__checkbox-input"/>
          <span className="boss-form__checkbox-label-text">
             Do not rehire this person (Give reason below)
          </span>
        </label>
      </div>
      <div className="boss-form__field">
        <p className="boss-form__label">
          <span className="boss-form__label-text boss-form__label-text_type_required">
            Reason for disabling
          </span>
        </p>
        <textarea className="boss-form__textarea"></textarea>
      </div>
      <div className="boss-form__field">
        <button
          className="boss-button boss-button_role_block boss-form__submit"
          onClick={onDisable}
        >
          Disable
        </button>
      </div>
    </div>
  )
}

const StaffMemberProfileActions = ({staffMember, onEditProfile, onEnableProfile, onDisableStaffMember, permissionsData}) => {
  const disabled = staffMember.get('disabled')
  const canEnable = oFetch(permissionsData.toJS(), 'canEnable');

  const disableStaffMember = () => {

  }

  return (
    disabled
      ? <div className="boss-page-dashboard__buttons-group">
          { canEnable && <button
            onClick={onEnableProfile}
            className="boss-button boss-button_role_unblock boss-page-dashboard__button"
          >Enable Staff Member</button> }
        </div>
      : <div className="boss-page-dashboard__buttons-group">
          <button
            onClick={onEditProfile}
            className="boss-button boss-button_role_edit boss-page-dashboard__button"
          >Edit Profile</button>
          <button
            className="boss-button boss-button_role_block boss-page-dashboard__button"
            onClick={onDisableStaffMember}
          >
            Disable Staff Member
          </button>
        </div>
  )
}

export default StaffMemberProfileActions;
