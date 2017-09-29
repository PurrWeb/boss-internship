import React from 'react';

export default function Tooltip({message, delimiter = false}) {
  const tooltipClassName = `boss-report__stats-tooltip ${delimiter ? 'boss-report__stats-tooltip_role_delimiter' : ''}`
  return (
    <span className={tooltipClassName}>
      <span className="boss-tooltip boss-tooltip_position_right-bottom">
        <span className="boss-tooltip__icon"></span>
        <span className="boss-tooltip__content">
          <span className="boss-tooltip__text">{message}</span>
        </span>
      </span>
    </span>
  )
}
