import React from "react"
import DashboardWrapper from './dashboard-wrapper';
import VenueDropdown from "~/components/venue-dropdown"
import safeMoment from "~/lib/safe-moment"
import DatePicker from 'react-datepicker';
import CalendarCustomInputLeft from '~/components/boss-form/calendar-custom-input-left';

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
              <DatePicker
                customInput={<CalendarCustomInputLeft />}
                withPortal="withPortal"
                calendarClassName="date-picker"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                selected={safeMoment.uiDateParse(date)}
                onChange={(date) => onChange({date, venueClientId})}
                dateFormat="DD-MM-YYYY"
                allowSameDay
              />
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

