import React from 'react';
import Tooltip from '~/components/boss-form/tooltip';

export default function MachinesReportsItemStat({
  label,
  value,
  statClasses = '',
  labelClasses = '',
  tip = '',
  tooltipDelimiter = false,
  extraValue = '',
}) {

  const statClassName = `boss-report__stats-item ${statClasses}`
  const labelClassName = `boss-report__stats-text ${labelClasses}`

  return (
    <div className={statClassName}>
      <div className="boss-report__stats-label">
        <p className={labelClassName}>
          <span>{label}</span>
          {tip && <Tooltip delimiter={tooltipDelimiter} message={tip} />}
        </p>
      </div>
      <div className="boss-report__stats-value">
        <p className="boss-report__stats-text boss-report__stats-text_size_m boss-report__stats-text_marked">
          {value}
          {extraValue && <span className="boss-report__stats-text-alert boss-report__stats-text-nowrap"> {extraValue}</span>}
        </p>
      </div>
    </div>
  )
}
