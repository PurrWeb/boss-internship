import React from "react"
import DashboardWrapper from './dashboard-wrapper';
import VenueDropdown from "~/components/venue-dropdown"
import moment from 'moment';
import DatePicker from 'react-datepicker';

export default function DashboardDate({
  title,
  date,
  onChange,
  venueClientId,
  venues,
}) {
  const selectedVenues = [venueClientId];
  const link = `/hours_confirmation/current?venue_id=${venues[venueClientId].serverId}`;

  return (
    <DashboardWrapper>
      <div className="boss-page-dashboard__group">
        <h1 className="boss-page-dashboard__title">
          <span className="boss-page-dashboard__title-text boss-page-dashboard__title-text_marked">
            {title}
          </span>
        </h1>
        <div className="boss-page-dashboard__controls-group">
        </div>
      </div>
      <div className="boss-page-dashboard__group">
        <div className="boss-page-dashboard__controls-group">
          <div className="boss-form">
            <div className="boss-form__row boss-form__row_justify_space boss-form__row_position_last">
              <div className="boss-form__field boss-form__field_role_control boss-form__field_layout_min boss-form__field_position_last">
                <p className="boss-form__label boss-form__label_type_icon-date boss-form__label_type_icon-single"></p>
                <div className="date-picker-input">
                  <DatePicker
                    withPortal="withPortal"
                    calendarClassName="date-picker"
                    showMonthDropdown
                    showYearDropdown
                    selected={moment(date)}
                    onChange={(date) => onChange({date, venueClientId})}
                    dateFormat="DD-MM-YYYY"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="boss-page-dashboard__buttons-group boss-page-dashboard__buttons-group_position_last">
          <a href={link} className="boss-button boss-button_role_calendar boss-page-dashboard__button">View current</a>
        </div>
      </div>
    </DashboardWrapper>
  )
}

