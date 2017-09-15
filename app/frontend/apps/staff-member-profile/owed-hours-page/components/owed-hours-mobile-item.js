import React from 'react';
import humanize from 'string-humanize';
import moment from 'moment';
import confirm from '~/lib/confirm-utils';
import {getOwedHourUIData} from './owed-hours-table';


const OwedHourMobileItem = ({owedHour, deleteOwedHour, openEditModal}) => {
  
  const onEdit = (owedHour) => {
    openEditModal(owedHour);
  }

  const onDelete = (id) => {
    confirm('Are you sure ?', {
      title: 'Delete Owed Hour',
      actionButtonText: 'Delete',
    }).then(() => {
      deleteOwedHour(id);
    });
  }
  
  const {
    date,
    times,
    durationHours,
    durationMinutes,
    creator,
    created,
    note,
    editable,
  } = getOwedHourUIData(owedHour);
  
  const duration = `${durationHours} hours ${durationMinutes} minutes`;
  const owedHourId = owedHour.get('id');

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
            {times}&nbsp;
          </span>
          <span>
            ({duration})
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
          {created}
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
    {editable && <div className="boss-check__row boss-check__row_role_actions">
        <button
          onClick={() => onEdit(owedHour)}
          className="boss-button boss-button_role_update boss-check__action"
        >Edit</button>
        <button
          onClick={() => onDelete(owedHourId)}
          className="boss-button boss-button_role_cancel boss-check__action"
        >Delete</button>
      </div>}

  </div>
}

export default OwedHourMobileItem;