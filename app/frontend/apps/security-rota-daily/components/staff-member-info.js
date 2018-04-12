import React from 'react';
import PropTypes from 'prop-types';

function StaffMemberInfo({ avatarUrl, fullName, staffType, staffColor }) {
  return (
    <div className="boss-user-summary boss-user-summary_role_rotas-daily">
      <div className="boss-user-summary__side">
        <div className="boss-user-summary__avatar">
          <div className="boss-user-summary__avatar-inner">
            <img src={avatarUrl} alt="" className="boss-user-summary__pic" />
          </div>
        </div>
      </div>
      <div className="boss-user-summary__content">
        <div className="boss-user-summary__header">
          <h2 className="boss-user-summary__name">{fullName}</h2>
          <p
            style={{ backgroundColor: staffColor }}
            className="boss-button boss-button_type_label boss-button_type_no-behavior boss-user-summary__label"
          >
            {staffType}
          </p>
        </div>
      </div>
    </div>
  );
}

StaffMemberInfo.propTypes = {
  avatarUrl: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  staffType: PropTypes.string.isRequired,
  staffColor: PropTypes.string.isRequired,
};

export default StaffMemberInfo;
