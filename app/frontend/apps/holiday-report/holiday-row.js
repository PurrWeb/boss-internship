import React from 'react';
import safeMoment from "~/lib/safe-moment";
import ToggleButton from '~/components/toggle-button';
import utils from '~/lib/utils';
import oFetch from 'o-fetch';

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
  constructor(props) {
    super(props);

    this.state = {
      showDetails: false
    }
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
        <div className="boss-table__cell boss-table__cell_role_header">Payslip Date</div>
      </div>
    )
  }

  renderHolidaysDetails(holidays) {
    return holidays.map((holiday, key) => {
      const mStartDate = safeMoment.uiDateParse(holiday.start_date);
      const startDateText = mStartDate.format('ddd Do MMM');
      const mEndDate = safeMoment.uiDateParse(holiday.end_date);
      const endDateText = mStartDate.format('ddd Do MMM');
      const mCreatedAt = safeMoment.iso8601Parse(holiday.created_at);
      const dateText = startDateText === endDateText ? startDateText : `${startDateText} - ${endDateText}`
      const sPayslipDate = oFetch(holiday, 'payslip_date');
      const payslipDateText = sPayslipDate ? safeMoment.uiDateParse(sPayslipDate).format(utils.commonDateFormat) : 'N/A';

      return (
        <div className="boss-table__row" key={key}>
          <DetailsCell label="Types">
            {holidayTypes[holiday.holiday_type]}
          </DetailsCell>
          <DetailsCell label="Dates">
            {dateText}
          </DetailsCell>
          <DetailsCell label="Note">
            {holiday.note || '-'}
          </DetailsCell>
          <DetailsCell label="Created By">
            <span className="boss-table__text-line">{oFetch(holiday, 'created_by')}</span>
            <span className="boss-table__text-meta">{`(${mCreatedAt.format(utils.humanDateFormatWithTime())})`}</span>
          </DetailsCell>
          <DetailsCell label="Payslip Date">
            {payslipDateText}
          </DetailsCell>
        </div>
      )
    })
  }

  renderHolidaysDetailsMobile(holidays) {
    return holidays.map((holiday, key) => {
      const mStartDate = safeMoment.uiDateParse(oFetch(holiday, 'start_date'));
      const mEndDate = safeMoment.uiDateParse(oFetch(holiday, 'end_date'));

      const startDateText = mStartDate.format('ddd Do MMM');
      const endDateText = mEndDate.format('ddd Do MMM');
      const createdAtText = safeMoment.iso8601Parse(holiday.created_at).format(utils.humanDateFormatWithTime());
      const dateText = startDateText === endDateText ? startDateText : `${startDateText} - ${endDateText}`;
      const sPayslipDate = oFetch(holiday, 'payslip_date');
      const payslipDateText = sPayslipDate ? safeMoment.uiDateParse(sPayslipDate).format(utils.commonDateFormat) : 'N/A';

      return (
        <div className="boss-check boss-check_role_panel boss-check_page_holidays-report-details" key={key}>
          <DetailsMobileRow>
            <p className="boss-check__title boss-check__title_role_payment">
              {holidayTypes[holiday.holiday_type]}
            </p>
          </DetailsMobileRow>
          <DetailsMobileRow>
            <p className="boss-check__text boss-check__text_role_date-calendar boss-check__text_marked">
              {dateText}
            </p>
          </DetailsMobileRow>
          <DetailsMobileRow>
            <p className="boss-check__text boss-check__text_role_user">
              <span className="boss-check__text-label">Created By: </span>
              {oFetch(holiday, 'created_by')}
            </p>
            <p className="boss-check__text boss-check__text_role_secondary">
              {`(${createdAtText})`}
            </p>
          </DetailsMobileRow>
          {!!holiday.note && <DetailsMobileRow>
              <div className="boss-check__box">
                <p className="boss-check__text boss-check__text_role_note">
                  {oFetch(holiday, 'note')}
                </p>
              </div>
            </DetailsMobileRow>
          }
          <DetailsMobileRow>
            <p className="boss-check__text boss-check__text_role_date">
            <span className="boss-check__text-label">Payslip Date: </span>{payslipDateText}</p>
          </DetailsMobileRow>
        </div>
      )
    })
  }

  render() {
    const staffMember = oFetch(this.props, 'staffMember');
    const staffMemberId = oFetch(staffMember, 'serverId');
    const staffTypes = oFetch(this.props, 'staffTypes');
    const staffType = staffTypes['CLIENT_ID_' + oFetch(staffMember, 'staff_type.serverId')];
    const client = this.props.holidays['CLIENT_ID_' + staffMemberId];
    const holidays = _.filter(Object.values(this.props.holidays), (holiday) => {
      const holidayStaffMember = oFetch(holiday, 'staff_member');
      return oFetch(holidayStaffMember, 'serverId') === oFetch(staffMember, 'serverId')
    });
    const paidHolidays = _.filter(holidays, (holiday) => {
      return oFetch(holiday, 'holiday_type') === PAYED_HOLIDAY
    });
    const unpaidHolidays = _.filter(holidays, (holiday) => {
      return oFetch(holiday, 'holiday_type') === UNPAYED_HOLIDAY
    });
    const staffMemberMasterVenue = _.find(this.props.venues, (venue) => {
      const masterVenue = oFetch(this.props, 'staffMember.master_venue');
      return oFetch(venue, 'serverId') === oFetch(masterVenue, 'serverId');
    });

    const paidCount = paidHolidays.length === 0
      ? 0
      : paidHolidays.reduce((sum, holiday) => sum = sum + oFetch(holiday, 'days'), 0);

    const unpaidCount = unpaidHolidays.length === 0
      ? 0
      : unpaidHolidays.reduce((sum, holiday) => sum = sum + oFetch(holiday, 'days'), 0);

    const serverId = oFetch(staffMember, 'serverId');
    const avatarUrl = oFetch(staffMember, 'avatar_url');
    const staffMemberName = `${oFetch(staffMember, 'first_name')} ${oFetch(staffMember, 'surname') }`

    const showDetails = oFetch(this.state, 'showDetails');

    return (
      <div className="boss-table__group" key={ serverId }>
        <div className="boss-table__row">
          <div className="boss-table__cell">
            <div className="boss-user-summary boss-user-summary_role_report">
              <div className="boss-user-summary__side">
                <div className="boss-user-summary__avatar">
                  <div className="boss-user-summary__avatar-inner">
                    <img src={ avatarUrl } alt="user avatar" className="boss-user-summary__pic" />
                  </div>
                </div>
              </div>
              <div className="boss-user-summary__content">
                <div className="boss-user-summary__header">
                  <h2 className="boss-user-summary__name">{ staffMemberName }</h2>
                  <p className="boss-button boss-button_type_label boss-button_role_bar-supervisor boss-user-summary__label" style={{ background: oFetch(staffType, 'color') }}>
                    { oFetch(staffType, 'name') }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {!this.props.hasCurrentVenue && <div className="boss-table__cell">
            <div className="boss-table__info">
              <p className="boss-table__label">Master Venue</p>
              <p className="boss-table__text boss-table__text_type_faded">{oFetch(staffMemberMasterVenue, 'name')}</p>
            </div>
          </div>}

          <div className="boss-table__cell">
            <div className="boss-table__info">
              <p className="boss-table__label">{paidCount === 1 ? `${paidCount} Paid Holiday` : `${paidCount} Paid Holidays`}</p>
                { this.renderHolidayCell(paidHolidays) }
            </div>
          </div>

          <div className="boss-table__cell">
            <div className="boss-table__info">
              <p className="boss-table__label">{ unpaidCount === 1 ? `${unpaidCount} Unpaid Holiday` : `${unpaidCount} Unpaid Holidays` }</p>
              { this.renderHolidayCell(unpaidHolidays) }
            </div>
          </div>

          <div className="boss-table__cell">
            <div className="boss-table__info">
              <p className="boss-table__label">Paid Holidays Days</p>
              <p className="boss-table__text">{ paidCount }</p>
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
        { showDetails && <div className="boss-table__dropdown">
          <div className="boss-table__dropdown-actions boss-table__dropdown-actions_justify_end">
            <a
              href={`/staff_members/${staffMemberId}/holidays`}
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
