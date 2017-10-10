import React from 'react';
import humanize from 'string-humanize';
import moment from 'moment';
import confirm from '~/lib/confirm-utils';

const HolidayMobileItem = ({holiday, deleteHoliday, onEditHoliday, isStaffMemberDisabled}) => {

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
  const cerated = `(${moment(holiday.get('created_at')).format('Do MMMM YYYY - HH:mm')})`;
  const startDate = moment(holiday.get('start_date'), 'D-M-Y').format('DD MMM Y')
  const endDate = moment(holiday.get('end_date'), 'D-M-Y').format('DD MMM Y')
  const editable = holiday.get('editable');
  
  return <div className="boss-check boss-check_role_panel boss-check_page_smp-holidays">
    <div className="boss-check__row">
      <div className="boss-check__cell">
        <p className="boss-check__title">{type}</p>
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
    { (editable && !isStaffMemberDisabled) && <div className="boss-check__row boss-check__row_role_actions">
      <button className="boss-button boss-button_role_update boss-check__action" onClick={() => (onEdit(holiday))}>
        Edit
      </button>
      <button className="boss-button boss-button_role_cancel boss-check__action" onClick={() => (onDelete(holiday.get('id')))}>
        Delete
      </button>
    </div> }
  </div>
}
export default class HolidayasMobileItems extends React.Component {
  constructor(props) {
    super(props);
  }

  renderMobileItems = (holidays) => {
    return holidays.map(holiday => {
      return <HolidayMobileItem
        holiday={holiday}
        deleteHoliday={this.props.deleteHoliday}
        onEditHoliday={this.props.onEditHoliday}
        key={holiday.get('id')}
        isStaffMemberDisabled={this.props.isStaffMemberDisabled}
      />
    })
  };

  render(){
    return <div>
      {this.renderMobileItems(this.props.holidays)}
    </div>
  }
}
