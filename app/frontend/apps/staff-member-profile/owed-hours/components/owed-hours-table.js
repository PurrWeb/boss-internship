import React from 'react';
import humanize from 'string-humanize';
import moment from 'moment';
import confirm from '~/lib/confirm-utils';

import OwedHoursMobileItems from './owed-hours-mobile-items';

const ActionsCell = ({label, owedHourId, deleteOwedHours}) => {
  
 const onDelete = (owedHourId) => {
    confirm('Are you sure ?', {
      title: 'Delete owed hours',
      actionButtonText: 'Delete',
    }).then(() => {
      deleteOwedHours(owedHourId);
    });
  }

  return (
    <div className="boss-table__cell">
      <div className="boss-table__info">
        <p className="boss-table__label">{label}</p>
        <p className="boss-table__actions">
          <button
            className="boss-button boss-button_type_small boss-button_role_update boss-table__action"
          >Edit</button>
          <button
            className="boss-button boss-button_type_small boss-button_role_cancel boss-table__action"
          >Delete</button>
        </p>
      </div>
    </div>
  )
}

const SimpleCell = ({label, text}) => {
  return (
    <div className="boss-table__cell">
      <div className="boss-table__info">
        <p className="boss-table__label">{label}</p>
        <p className="boss-table__text">{text}</p>
      </div>
    </div>
  )
}

const CreatedByCell = ({label, creator, created}) => {
  return (
    <div className="boss-table__cell">
      <div className="boss-table__info">
        <p className="boss-table__label">{label}</p>
        <p className="boss-table__text">
          <span className="boss-table__text-line">
            {creator}
          </span>
          <span className="boss-table__text-meta">
            {created}
          </span>
        </p>
      </div>
    </div>
  )
}

const Row = ({owedHour, deleteOwedHours}) => {
  const date = moment(owedHour.get('date')).format('DD MMM YYYY');
  const startTime = moment(owedHour.get('start_date')).format('DD MMM YYYY');
  const endTime = moment(owedHour.get('end_date')).format('DD MMM YYYY');
  const durationHours = owedHour.get('hours');
  const durationMinutes = owedHour.get('minutes');
  const note = owedHour.get('note') || '-';
  const creator = owedHour.get('creator');
  const cerated = `(${moment(owedHour.get('created_at')).format('Do MMMM YYYY - HH:mm')})`;

  return (
    <div className="boss-table__row">
      <SimpleCell label="date" text={date} />
      <SimpleCell label="times" text={`${startTime} - ${endTime}`} />
      <SimpleCell label="duration (hours)" text={durationHours} />
      <SimpleCell label="duration (minutes)" text={durationMinutes} />      
      <CreatedByCell label="createdBy" creator={creator} created={cerated} />
      <SimpleCell label="note" text={note} />
      <ActionsCell label="actions" owedHourId={owedHour.get('id')} deleteOwedHours={deleteOwedHours} />
    </div>
  )
}

const Header = () => {
  return (
    <div className="boss-table__row">
      <div className="boss-table__cell boss-table__cell_role_header">Date</div>
      <div className="boss-table__cell boss-table__cell_role_header">Times</div>
      <div className="boss-table__cell boss-table__cell_role_header">Duration (hours)</div>
      <div className="boss-table__cell boss-table__cell_role_header">Duration (minuts)</div>
      <div className="boss-table__cell boss-table__cell_role_header">Created By</div>
      <div className="boss-table__cell boss-table__cell_role_header">Note</div>
      <div className="boss-table__cell boss-table__cell_role_header"></div>
    </div>
  )
}

const OwedStats = ({week, totalHours}) => {
  return (
    <div className="boss-board__manager-stats boss-board__manager-stats_role_group-header">
      <div className="boss-count boss-count_adjust_flow boss-count_type_solid">
        <p className="boss-count__label boss-count__label_role_date">{week}</p>
      </div>
      <div className="boss-count boss-count_adjust_flow boss-count_type_solid">
        <p className="boss-count__label boss-count__label_role_time">{totalHours}</p>
      </div>
    </div>
  )

};


const OwedHoursTableDesktop = ({owedHours, deleteOwedHours}) => {
  const week = "dummy week data"
  const totalHours = "dummy total hours data"

  const renderHolidays = (owedHours) => {
    return owedHours.map(owedHour => {
      return <Row key={owedHour.get('id')} owedHour={owedHour} deleteOwedHours={deleteOwedHours}/>
    })
  }

  return (
    <div>
      <div className="boss-board__manager-stats boss-board__manager-stats_role_group-header">
        <OwedStats week={week} totalHours={totalHours}/>
      </div>
      <div className="boss-board__manager-table">
        <div className="boss-table boss-table_page_smp-owed-hours">
          <Header />
          { renderHolidays(owedHours) }
        </div>
      </div>
    </div>
  )
}

const OwedHoursTable = ({owedhours, deleteOwedHours}) => {
  return (
    <div >
      <OwedHoursTableDesktop owedHours={owedhours} deleteOwedHours={deleteOwedHours} />
    </div>
  )
}

export default OwedHoursTable;
