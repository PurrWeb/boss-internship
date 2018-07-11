import React from 'react';
import humanize from 'string-humanize';
import safeMoment from '~/lib/safe-moment';
import oFetch from 'o-fetch';
import pluralize from 'pluralize';
import confirm from '~/lib/confirm-utils';
import utils from '~/lib/utils';
import classNames from 'classnames';
import { staffMemberProfileHolidaysPermissions } from '~/lib/permissions';

const PENDING_STATUS = 'pending';
const ACCEPTED_STATUS = 'accepted';
const REJECTED_STATUS = 'rejected';

const statusClasses = {
  [PENDING_STATUS]: 'boss-table__text_role_pending-status',
  [ACCEPTED_STATUS]: 'boss-table__text_role_success-status',
  [REJECTED_STATUS]: 'boss-table__text_role_alert-status',
};

const HolidayMobileItem = ({ holiday, deleteHoliday, onEditHoliday, isStaffMemberDisabled, permissionsData }) => {
  const onEdit = holiday => {
    onEditHoliday(holiday);
  };

  const onDelete = holiday => {
    confirm('Are you sure ?', {
      title: 'Delete Holiday',
      actionButtonText: 'Delete',
    }).then(() => {
      deleteHoliday(holiday);
    });
  };

  const jsHoliday = holiday.toJS();
  const typeText = humanize(oFetch(jsHoliday, 'holiday_type'));
  const note = jsHoliday.note || '-';
  const creator = oFetch(jsHoliday, 'creator');
  const status = humanize(oFetch(jsHoliday, 'state'));
  const createdAtText = `(${safeMoment.iso8601Parse(oFetch(jsHoliday, 'created_at')).format('Do MMMM YYYY - HH:mm')})`;
  const startDateText = safeMoment.uiDateParse(oFetch(jsHoliday, 'start_date')).format('DD MMM Y');
  const endDateText = safeMoment.uiDateParse(oFetch(jsHoliday, 'end_date')).format('DD MMM Y');
  const holidayType = oFetch(jsHoliday, 'type');
  const id = oFetch(jsHoliday, 'id');
  const holidayDaysCount = utils.getDaysCountFromInterval(
    oFetch(jsHoliday, 'start_date'),
    oFetch(jsHoliday, 'end_date'),
  );
  const sPayslipDate = oFetch(jsHoliday, 'payslip_date');
  const payslipDateText = sPayslipDate ? safeMoment.uiDateParse(sPayslipDate).format(utils.commonDateFormat) : 'N/A'

  const isEditable =
    holidayType === 'holiday'
      ? oFetch(staffMemberProfileHolidaysPermissions, 'canEditHoliday')({ permissionsData: permissionsData, id: id })
      : oFetch(staffMemberProfileHolidaysPermissions, 'canEditHolidayRequest')({
          permissionsData: permissionsData,
          id: id,
        });
  const isDeletable =
    holidayType === 'holiday'
      ? oFetch(staffMemberProfileHolidaysPermissions, 'canDestroyHoliday')({ permissionsData: permissionsData, id: id })
      : oFetch(staffMemberProfileHolidaysPermissions, 'canDestroyHolidayRequest')({
          permissionsData: permissionsData,
          id: id,
        });

  const isFrozen = oFetch(jsHoliday, 'frozen');
  const itemClass = classNames({
    'boss-check boss-check_role_panel boss-check_page_smp-holidays': true,
    'boss-check_state_frozen': isFrozen,
  });

  return (
    <div className={itemClass}>
      <div className="boss-check__row">
        <div className="boss-check__cell">
          <p className="boss-check__title">
            {holidayDaysCount} {pluralize(typeText, holidayDaysCount)}
          </p>
        </div>
      </div>
      <div className="boss-check__row">
        <div className="boss-check__cell">
          <p className={`boss-check__text_marked ${statusClasses[holiday.get('state')]}`}>{status}</p>
        </div>
      </div>
      <div className="boss-check__row">
        <div className="boss-check__cell">
          <p className="boss-check__text boss-check__text_role_date-calendar boss-check__text_marked">
            {utils.formatDateForHoliday(jsHoliday)}
          </p>
        </div>
      </div>
      <div className="boss-check__row">
        <div className="boss-check__cell">
          <p className="boss-check__text boss-check__text_role_user">
            <span className="boss-check__text-label">Created by: </span>
            {creator}
          </p>
          <p className="boss-check__text boss-check__text_role_secondary">{createdAtText}</p>
        </div>
      </div>
      {note !== '-' && (
        <div className="boss-check__row">
          <div className="boss-check__cell">
            <div className="boss-check__box">
              <p className="boss-check__text boss-check__text_role_note">{note}</p>
            </div>
          </div>
        </div>
      )}
      <div className="boss-check__row">
        <div className="boss-check__cell">
          <p className="boss-check__text boss-check__text_role_date">
          <span className="boss-check__text-label">Payslip Date: </span>
            {payslipDateText}
          </p>
        </div>
      </div>
      {!isFrozen && (
        <div className="boss-check__row boss-check__row_role_actions">
          {isEditable && (
            <button className="boss-button boss-button_role_update boss-check__action" onClick={() => onEdit(holiday)}>
              Edit
            </button>
          )}
          {isDeletable && (
            <button
              className="boss-button boss-button_role_cancel boss-check__action"
              onClick={() => onDelete(holiday)}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};
export default class HolidayMobileItems extends React.Component {
  constructor(props) {
    super(props);
  }

  renderMobileItems = holidays => {
    const permissionsData = oFetch(this.props, 'permissionsData');
    return holidays.map(holiday => {
      const holidayId = oFetch(holiday.toJS(), 'id');
      return (
        <HolidayMobileItem
          holiday={holiday}
          deleteHoliday={this.props.deleteHoliday}
          onEditHoliday={this.props.onEditHoliday}
          key={holidayId}
          isStaffMemberDisabled={this.props.isStaffMemberDisabled}
          permissionsData={permissionsData}
        />
      );
    });
  };

  render() {
    return <div>{this.renderMobileItems(oFetch(this.props, 'holidays'), oFetch(this.props, 'permissionsData'))}</div>;
  }
}
