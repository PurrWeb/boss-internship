import React from 'react';
import safeMoment from "~/lib/safe-moment";
import ToggleButton from '~/components/toggle-button';
import utils from '~/lib/utils';

const PAYED_HOLIDAY = 'paid_holiday';
const UNPAYED_HOLIDAY = 'unpaid_holiday';

const holidayTypes = {
  [PAYED_HOLIDAY]: 'Paid Holiday',
  [UNPAYED_HOLIDAY]: 'Unpaid Holiday'
}

const DetailsCell = ({children, label}) => {
  return (
    <div className="boss-table__cell">
      <div className="boss-table__info">
      <p className="boss-table__label">{label}</p>
      <p className="boss-table__text">{children}</p>
    </div>
  </div>
  )
}

const DetailsMobileRow = ({children}) => {
  return (
    <div className="boss-check__row">
      <div className="boss-check__cell">
        {children}
      </div>
    </div>
  )
}

export default class HolidayRow extends React.Component {
  
  state = {
    showDetails: false,
  }

  renderHolidayCell(holidays) {
    if (holidays.length === 0) {
      return <p className="boss-table__text boss-table__text_type_faded">None this week</p>;
    }

    return holidays.map((holiday, key) => {
      return <p key={key} className="boss-table__text boss-table__text_type_faded">{utils.formatDateForHoliday(holiday)}</p>
    })
  }

  handleToggleButton = (toggle) => {
    this.setState({showDetails: toggle})
  }

  renderDetailsHeader() {
    return (
      <div className="boss-table__row">
        <div className="boss-table__cell boss-table__cell_role_header">Types</div>
        <div className="boss-table__cell boss-table__cell_role_header">Dates</div>
        <div className="boss-table__cell boss-table__cell_role_header">Note</div>
        <div className="boss-table__cell boss-table__cell_role_header">Created By</div>
      </div>
    )
  }

  renderHolidaysDetails(holidays) {
    return holidays.map((holiday, key) => {
      const startDate = safeMoment.uiDateParse(holiday.start_date).format('ddd Do MMM');
      const endDate = safeMoment.uiDateParse(holiday.end_date).format('ddd Do MMM');
      const createdAt = safeMoment.iso8601Parse(holiday.created_at).format(utils.humanDateFormatWithTime());
      const date = startDate === endDate ? startDate : `${startDate} - ${endDate}`
      return (
        <div className="boss-table__row" key={key}>
          <DetailsCell label="Types">
            {holidayTypes[holiday.holiday_type]}
          </DetailsCell>
          <DetailsCell label="Dates">
            {date}
          </DetailsCell>
          <DetailsCell label="Note">
            {holiday.note || '-'}
          </DetailsCell>
          <DetailsCell label="Created By">
            <span className="boss-table__text-line">{holiday.created_by}</span>
            <span className="boss-table__text-meta">{`(${createdAt})`}</span>
          </DetailsCell>
        </div>
      )
    })
  }
  
  renderHolidaysDetailsMobile(holidays) {
    return holidays.map((holiday, key) => {
      const startDate = safeMoment.uiDateParse(holiday.start_date).format('ddd Do MMM');
      const endDate = safeMoment.uiDateParse(holiday.end_date).format('ddd Do MMM');
      const createdAt = safeMoment.iso8601Parse(holiday.created_at).format(utils.humanDateFormatWithTime());
      const date = startDate === endDate ? startDate : `${startDate} - ${endDate}`
      return (
        <div className="boss-check boss-check_role_panel boss-check_page_holidays-report-details" key={key}>
          <DetailsMobileRow>
            <p className="boss-check__title boss-check__title_role_payment">
              {holidayTypes[holiday.holiday_type]}
            </p>
          </DetailsMobileRow>
          <DetailsMobileRow>
            <p className="boss-check__text boss-check__text_role_date-calendar boss-check__text_marked">
              {date}
            </p>
          </DetailsMobileRow>
          <DetailsMobileRow>
            <p className="boss-check__text boss-check__text_role_user">
              <span className="boss-check__text-label">Created By: </span>
              {holiday.created_by}
            </p>
            <p className="boss-check__text boss-check__text_role_secondary">
              {`(${createdAt})`}
            </p>
          </DetailsMobileRow>
          {!!holiday.note && <DetailsMobileRow>
              <div className="boss-check__box">
                <p className="boss-check__text boss-check__text_role_note">
                  {holiday.note}
                </p>
              </div>
            </DetailsMobileRow>
          }
        </div>
      )
    })
  }

  render() {
    const staffType = this.props.staffTypes['CLIENT_ID_' + this.props.staffMember.staff_type.serverId];
    const client = this.props.holidays['CLIENT_ID_' + this.props.staffMember.serverId];
    const holidays = _.filter(Object.values(this.props.holidays), (holiday) => {
      return holiday.staff_member.serverId === this.props.staffMember.serverId
    });
    const paidHoliday = _.filter(holidays, (holiday) => {
      return holiday.holiday_type === PAYED_HOLIDAY
    });
    const unpaidHoliday = _.filter(holidays, (holiday) => {
      return holiday.holiday_type === UNPAYED_HOLIDAY
    });
    const staffMemberMasterVenue = _.find(this.props.venues, (venue) => {
      return venue.serverId === this.props.staffMember.master_venue.serverId;
    });

    const payedCount = paidHoliday.length === 0
      ? 0
      : paidHoliday.reduce((summ, holiday) => summ = summ + holiday.days, 0);

    const unpaidCount = unpaidHoliday.length === 0
      ? 0
      : unpaidHoliday.reduce((sum, holiday) => sum = sum + holiday.days, 0);

    return (
      <div className="boss-table__group" key={ this.props.staffMember.serverId }>
        <div className="boss-table__row">
          <div className="boss-table__cell">
            <div className="boss-user-summary boss-user-summary_role_report">
              <div className="boss-user-summary__side">
                <div className="boss-user-summary__avatar">
                  <div className="boss-user-summary__avatar-inner">
                    <img src={ this.props.staffMember.avatar_url } alt="user avatar" className="boss-user-summary__pic" />
                  </div>
                </div>
              </div>
              <div className="boss-user-summary__content">
                <div className="boss-user-summary__header">
                  <h2 className="boss-user-summary__name">{ this.props.staffMember.first_name + ' ' + this.props.staffMember.surname }</h2>
                  <p className="boss-button boss-button_type_label boss-button_role_bar-supervisor boss-user-summary__label" style={{ background: staffType.color }}>
                    { staffType.name }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {!this.props.hasCurrentVenue && <div className="boss-table__cell">
            <div className="boss-table__info">
              <p className="boss-table__label">Master Venue</p>
              <p className="boss-table__text boss-table__text_type_faded">{staffMemberMasterVenue.name}</p>
            </div>
          </div>}

          <div className="boss-table__cell">
            <div className="boss-table__info">
              <p className="boss-table__label">{payedCount === 1 ? `${payedCount} Paid Holiday` : `${payedCount} Paid Holidays`}</p>
                { this.renderHolidayCell(paidHoliday) }
            </div>
          </div>

          <div className="boss-table__cell">
            <div className="boss-table__info">
              <p className="boss-table__label">{ unpaidCount === 1 ? `${unpaidCount} Unpaid Holiday` : `${unpaidCount} Unpaid Holidays` }</p>
              { this.renderHolidayCell(unpaidHoliday) }
            </div>
          </div>

          <div className="boss-table__cell">
            <div className="boss-table__info">
              <p className="boss-table__label">Paid Holidays Days</p>
              <p className="boss-table__text">{ payedCount }</p>
            </div>
          </div>

          <div className="boss-table__cell">
            <div className="boss-table__info">
              <div className="boss-table__actions">
                <ToggleButton
                  className="boss-button boss-button_type_small boss-button_role_details-show"
                  toggleClassName="boss-button boss-button_type_small boss-button_role_details-hide"
                  onClick={(toggle) => this.handleToggleButton(toggle)}
                  text="View All"
                  toggleText="Hide"
                />                  
              </div>
            </div>
          </div>
        </div>
        {this.state.showDetails && <div className="boss-table__dropdown">
          <div className="boss-table__dropdown-actions boss-table__dropdown-actions_justify_end">
            <a
              href={`/staff_members/${this.props.staffMember.serverId}/holidays`}
              className="boss-button boss-button_type_small boss-button_role_edit"
            >Edit</a>
          </div>
          <div className="boss-table boss-table_page_holidays-report-details">
            {this.renderDetailsHeader()}
            {this.renderHolidaysDetails(holidays)}
          </div>
          {this.renderHolidaysDetailsMobile(holidays)}
        </div>}

      </div>
    )
  }
}
