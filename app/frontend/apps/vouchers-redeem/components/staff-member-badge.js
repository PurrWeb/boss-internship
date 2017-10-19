import React from 'react';

export default function StaffMemberBadge({
  children,
  avatarUrl
}) {
  let iconSrc = "http://boss-styles.herokuapp.com/images/user-light-gray.svg";

  return (
    <div className="boss-form-badge boss-form-badge_adjust_rv">
      <div className="boss-form-badge__figure">
        { !avatarUrl && <div className="boss-form-badge__image boss-form-badge__image_role_user"/> }
        { avatarUrl && <div
            className="boss-form-badge__image boss-form-badge__image_role_user">
            <img src={avatarUrl} alt="Staff Member" />                          </div> }
        <h3 className="boss-form-badge__caption">Staff Member</h3>
      </div>
      <div className="boss-form-badge__fields">
        <div className="boss-form-badge__field">
          <div className="boss-form-badge__select">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
};
