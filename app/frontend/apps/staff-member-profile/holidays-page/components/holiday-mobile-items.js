import React from 'react';
import humanize from 'string-humanize';
import safeMoment from "~/lib/safe-moment";
import oFetch from 'o-fetch';
import confirm from '~/lib/confirm-utils';
import { staffMemberProfileHolidaysPermissions } from '~/lib/permissions';

const PENDING_STATUS = 'pending';
const ACCEPTED_STATUS = 'accepted';
const REJECTED_STATUS = 'rejected';

const statusClasses = {
  [PENDING_STATUS]: 'boss-table__text_role_pending-status',
  [ACCEPTED_STATUS]: 'boss-table__text_role_success-status',
  [REJECTED_STATUS]: 'boss-table__text_role_alert-status',
};

const HolidayMobileItem = ({holiday, deleteHoliday, onEditHoliday, isStaffMemberDisabled, permissionsData}) => {

  const onEdit = (holiday) => {
    onEditHoliday(holiday);
  }

  const onDelete = (id) => {
    confirm('Are you sure ?', {
      title: 'Delete Holiday',
      actionButtonText: 'Delete',
    }).then(() => {
      deleteHoliday(id);
    });
  }

  const type = humanize(holiday.get('holiday_type'));
  const note = holiday.get('note') || '-';
  const creator = holiday.get('creator');
  const status = humanize(holiday.get('state'));
  const cerated = `(${safeMoment.iso8601Parse(holiday.get('created_at')).format('Do MMMM YYYY - HH:mm')})`;
  const startDate = safeMoment.uiDateParse(holiday.get('start_date')).format('DD MMM Y')
  const endDate = safeMoment.uiDateParse(holiday.get('end_date')).format('DD MMM Y')
  const holidayData = holiday.toJS();
  const id = oFetch(holidayData, 'id');

  const isEditable = oFetch(holidayData, 'type') === 'holiday' ? oFetch(staffMemberProfileHolidaysPermissions, 'canEditHoliday')({ permissionsData: permissionsData, id: id }) : oFetch(staffMemberProfileHolidaysPermissions, 'canEditHolidayRequest')({ permissionsData: permissionsData, id: id });
  const isDeletable = oFetch(holidayData, 'type') === 'holiday' ? oFetch(staffMemberProfileHolidaysPermissions, 'canDestroyHoliday')({ permissionsData: permissionsData, id: id }) : oFetch(staffMemberProfileHolidaysPermissions, 'canDestroyHolidayRequest')({ permissionsData: permissionsData, id: id });

  return <div className="boss-check boss-check_role_panel boss-check_page_smp-holidays">
    <div className="boss-check__row">
      <div className="boss-check__cell">
        <p className="boss-check__title">{type}</p>
      </div>
    </div>
    <div className="boss-check__row">
      <div className="boss-check__cell">
        <p className={`boss-check__text_marked ${statusClasses[holiday.get('state')]}`}>{status}</p>
      </div>
    </div>
    <div className="boss-check__row">
      <div className="boss-check__cell">
        <p className="boss-check__text boss-check__text_role_date-calendar boss-check__text_marked">{startDate} - {endDate}</p>
      </div>
    </div>
    <div className="boss-check__row">
      <div className="boss-check__cell">
        <p className="boss-check__text boss-check__text_role_user">
          <span className="boss-check__text-label">Created by: </span>
          {creator}
        </p>
        <p className="boss-check__text boss-check__text_role_secondary">
          {cerated}
        </p>
      </div>
    </div>
    {
    note !== '-' &&
      <div className="boss-check__row">
        <div className="boss-check__cell">
          <div className="boss-check__box">
            <p className="boss-check__text boss-check__text_role_note">{note}</p>
          </div>
        </div>
      </div>
    }
    <div className="boss-check__row boss-check__row_role_actions">
      { isEditable && <button className="boss-button boss-button_role_update boss-check__action" onClick={() => (onEdit(holiday))}>
          Edit
        </button> }
      { isDeletable && <button className="boss-button boss-button_role_cancel boss-check__action" onClick={() => (onDelete(holiday.get('id')))}>
          Delete
        </button> }
    </div>
  </div>
}
export default class HolidayMobileItems extends React.Component {
  constructor(props) {
    super(props);
  }

  renderMobileItems = (holidays) => {
    const permissionsData = oFetch(this.props, 'permissionsData');
    return holidays.map(holiday => {
      const holidayId = oFetch(holiday.toJS(), 'id');
      return <HolidayMobileItem
        holiday={holiday}
        deleteHoliday={this.props.deleteHoliday}
        onEditHoliday={this.props.onEditHoliday}
        key={holidayId}
        isStaffMemberDisabled={this.props.isStaffMemberDisabled}
        permissionsData={permissionsData}
      />
    })
  };

  render(){
    return <div>
      {
        this.renderMobileItems(
          oFetch(this.props, 'holidays'),
          oFetch(this.props, 'permissionsData')
        )
      }
    </div>
  }
}
