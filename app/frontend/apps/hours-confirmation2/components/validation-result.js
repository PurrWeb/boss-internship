import React from "react";
import ErrorMessage from './error-message';

const ValidationResult = ({result}) => {
  return result.isValid
    ? null
    : <ErrorMessage>
          {result.messages.map(
              (msg, i) => <p className="boss-time-shift__error-text" key={i}>{msg}</p>
          )}
      </ErrorMessage>
}

export default ValidationResult;
