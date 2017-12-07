<<<<<<< HEAD
import React from 'react';
import BossWeekPicker from '~/components/react-dates/boss-week-picker';
import { appRoutes } from '~/lib/routes';
import safeMoment from '~/lib/safe-moment';
import classNames from 'classnames';
import Popover from 'react-popover';
import utils from '~/lib/utils';
import { createHoliday } from './actions';
import WeekAndVenueSelector from "~/components/week-and-venue-selector";
import WeekPicker from "~/components/week-picker";
import openModal from './boss-modal';
import AddHoliday from './add-holiday';

export default class ReportsHeader extends React.Component {
  state = {
    isCalendarOpen: false,
  };

  togglePopover = () => {
    this.setState({ isCalendarOpen: !this.state.isCalendarOpen });
  };

  renderCalendar = () => {
    return (
      <div className="boss-popover__inner">
        <BossWeekPicker
          selectionStartUIDate={this.props.pageOptions.weekStartDate}
          onChange={({ startUIDate }) => {
            location.href = appRoutes.holidays({
              startDate: startUIDate,
            });
          }}
          onCancelClick={this.togglePopover}
        />
      </div>
    );
  };

  renderCsvDownloadButton(props) {
    let holidayCount = Object.keys(props.holidays).length;

    if (props.pageOptions.displayCsvLink && props.pageOptions.weekStartDate && holidayCount > 0) {
      return (
        <a
          className="boss-button boss-button_role_csv-download boss-page-dashboard__button"
          href={appRoutes.holidaysCsv({
            date: props.pageOptions.weekStartDate,
            venueId: props.pageOptions.venueServerId,
          })}
        >
          Download as CSV
        </a>
      );
    }
  }

  submit = (hideModal, values) => {
    return this.props.actions.createHoliday(values, hideModal);
  }

  renderAddHolidayButton() {
    return (
      <button
        onClick={() => openModal(this.submit, {
          venueId: this.props.pageOptions.currentVenueId,
        })(AddHoliday)}
        className="boss-button boss-button_role_add boss-page-dashboard__button"
      >Add Holidays</button>
    )
  }

  render() {
    let accessibleVenues = _.pick(this.props.venues, (venue, clientId) => {
      return this.props.pageOptions.accessibleVenueIds.includes(venue.serverId);
    });

    let today = safeMoment.uiDateParse(this.props.pageOptions.weekStartDate).format(utils.commonDateFormatCalendar());
    let nextWeek = safeMoment
      .uiDateParse(this.props.pageOptions.weekStartDate)
      .add(6, 'days')
      .format(utils.commonDateFormatCalendar());
    const popoverClass = classNames({
      'boss-page-dashboard__meta-item boss-page-dashboard__meta-item_type_faded boss-page-dashboard__meta-item_role_date boss-page-dashboard__meta-item_role_popover': true,
      'boss-page-dashboard__meta-item_state_opened': this.state.isCalendarOpen,
    });
    return (
      <div className="boss-page-main__dashboard">
        <div className="boss-page-main__inner">
          <div className="boss-page-dashboard boss-page-dashboard_updated boss-page-dashboard_page_holidays-report">
            <h1 className="boss-page-dashboard__title">Holiday Reports</h1>

            <div className="boss-page-dashboard__group">
              <div className="boss-page-dashboard__meta">
                <Popover
                  isOpen={this.state.isCalendarOpen}
                  body={this.renderCalendar()}
                  place="below"
                  tipSize={0.01}
                  onOuterAction={this.togglePopover}
                  className="boss-popover boss-popover_context_dashboard-week-picker boss-popover_state_opened"
                  style={{ marginTop: '10px' }}
                >
                  <p className={popoverClass} onClick={this.togglePopover}>
                    <span className="boss-page-dashboard__meta-text">{today}</span>
                    {' - '}
                    <span className="boss-page-dashboard__meta-text">{nextWeek}</span>
                  </p>
                </Popover>
              </div>

              <div className="boss-page-dashboard__buttons-group">
                { this.renderAddHolidayButton() }
                { this.renderCsvDownloadButton(this.props) }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
