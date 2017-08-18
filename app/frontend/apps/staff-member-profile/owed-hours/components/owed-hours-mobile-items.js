import React from 'react';
import humanize from 'string-humanize';
import moment from 'moment';
import confirm from '~/lib/confirm-utils';

const OwedHourMobileItem = ({owedHour, deleteOwedHour}) => {

  const onDelete = (id) => {
    confirm('Are you sure ?', {
      title: 'Delete Owed Hour',
      actionButtonText: 'Delete',
    }).then(() => {
      deleteOwedHour(id);
    });
  }

  const date = moment(owedHour.get('date')).format('ddd DD MMM YYYY');
  const startTime = moment(owedHour.getIn(['times', 'startsAt'])).format('HH:mm');
  const endTime = moment(owedHour.getIn(['times', 'endsAt'])).format('HH:mm');
  const durationHours = owedHour.getIn(['duration','hours']);
  const durationMinutes = owedHour.getIn(['duration', 'minutes']);
  const duration = `(${durationHours} hours ${durationMinutes} minutes)`
  const note = owedHour.get('note') || '-';
  const creator = owedHour.get('createdBy');
  const cerated = `(${moment(owedHour.get('created_at')).format('Do MMMM YYYY - HH:mm')})`;
  const editable = owedHour.get('editable');

  return <div className="boss-check boss-check_role_panel boss-check_page_smp-owed-hours">
    <div className="boss-check__row">
      <div className="boss-check__cell">
        <p className="boss-check__title">{date}</p>
      </div>
    </div>
    <div className="boss-check__row">
      <div className="boss-check__cell">
        <p className="boss-check__text boss-check__text_role_time boss-check__text_marked">
          <span>
            {startTime} - {endTime}
          </span>
          <span>
            {duration} 
          </span>
        </p>
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
      <button className="boss-button boss-button_role_update boss-check__action">
        Edit
      </button>
      <button className="boss-button boss-button_role_cancel boss-check__action">
        Delete
      </button>
    </div>
  </div>
}
export default class OwedHourMobileItems extends React.Component {
  constructor(props) {
    super(props);
  }

  renderMobileItems = (owedhours) => {
    return owedhours.map(owedhour => {
      return <OwedHourMobileItem owedHour={owedhour} key={owedhour.get('id')} />
    })
  };

  render(){
    return <div>
      {this.renderMobileItems(this.props.owedhours)}
    </div>
  }
}