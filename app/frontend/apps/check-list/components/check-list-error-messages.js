import React from 'react';

export const ErrorWarning = ({children}) => {
  return <div className="boss-checklist__alert">
    <div className="boss-alert boss-alert_role_info">
      <p className="boss-alert__text">{children} </p>
    </div>
  </div>
};

export const ErrorMessage = ({children}) => {
  return <div className="boss-checklist__message">
    <div className="boss-message boss-message_role_checklist-note">
      <div className="boss-message__text">
        {children}
      </div>
    </div>
  </div>
};
