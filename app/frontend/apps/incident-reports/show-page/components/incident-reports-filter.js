import React from 'react';

import FormDateInterval from './form-date-interval';

const IncidentReportsFilter = ({
  startDate,
  endDate,
}) => {
  const onDatesChange = ({startDate, endDate}) => {
    console.log(startDate, endDate);
  }

  return (
    <div className="boss-dropdown__content boss-dropdown__content_state_opened">
      <div className="boss-dropdown__content-inner">
        <div className="boss-form">
          <div className="boss-form__row">
            <FormDateInterval
              label="Date"
              startDate={startDate}
              endDate={endDate}
              fieldClassName="boss-form__field_layout_half"
              onDatesChange={onDatesChange}
            />
          </div>
          <div className="boss-form__field">
            <button
              className="boss-button boss-form__submit boss-form__submit_adjust_single"
            >Update</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IncidentReportsFilter;
