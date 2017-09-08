import React from "react";

const ErrorMessage = ({children, title}) => {
  return (
    <div className="boss-time-shift__error">
      { !!title && <p className="boss-time-shift__error-text boss-time-shift__error-text_role_title">{title}</p> }
      {children}
    </div>
  )
}

export default ErrorMessage;
