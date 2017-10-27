import React from 'react';

export default function ErrorBlock({error}) {
  return (
    <div className="boss-form__error">
      <p className="boss-form__error-text">
        <span className="boss-form__error-line">{error}</span>
      </p>
    </div>
  )
}
