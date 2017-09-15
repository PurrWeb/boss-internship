import React from 'react';

const DashboardProfile = ({title, onCancel, buttonText}) => {
  return (
    <div className="boss-page-dashboard boss-page-dashboard_updated boss-page-dashboard_page_profile-edit">
      <div className="boss-page-dashboard__group">
        <h1 className="boss-page-dashboard__title">
          {title}
        </h1>
        <div className="boss-page-dashboard__buttons-group boss-page-dashboard__buttons-group_position_last">
          <button
            onClick={() => onCancel()}
            className="boss-button boss-button_role_cancel boss-page-dashboard__button"
          >{buttonText}</button>
        </div>
      </div>
    </div>
  );
}

export default DashboardProfile;
