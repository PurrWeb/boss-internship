import React from 'react';
import humanize from 'string-humanize';
import moment from 'moment';
import confirm from '~/lib/confirm-utils';

const ActionsCell = ({label, holidaysId,holiday, deleteHoliday, onEditHoliday, editableHoliday}) => {
  
  const openEditHoliday = () => {
   onEditHoliday(holiday)
  }

 const onDelete = (holidaysId) => {
    confirm('Are you sure ?', {
      title: 'Delete holiday',
      actionButtonText: 'Delete',
    }).then(() => {
      deleteHoliday(holidaysId);

    });
  }

  return (
    <div className="boss-table__cell">
      <div className="boss-table__info">
        <p className="boss-table__label">{label}</p>
        { editableHoliday && <p className="boss-table__actions">
          <button
            onClick={openEditHoliday}
            className="boss-button boss-button_type_small boss-button_role_update boss-table__action"
          >Edit</button>
          <button
            onClick={() => (onDelete(holidaysId))}
            className="boss-button boss-button_type_small boss-button_role_cancel boss-table__action"
          >Delete</button>
        </p> }
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

const Row = ({holiday, deleteHoliday, onEditHoliday}) => {
  const type = humanize(holiday.get('holiday_type'));
  const startDate = moment(holiday.get('start_date'), "DD-MM-YYYY").format('DD MMM YYYY');
  const endDate = moment(holiday.get('end_date'), "DD-MM-YYYY").format('DD MMM YYYY');
  const note = holiday.get('note') || '-';
  const creator = holiday.get('creator');
  const cerated = `(${moment(holiday.get('created_at')).format('Do MMMM YYYY - HH:mm')})`;
  const editable = holiday.get('editable');

  return (
    <div className="boss-table__row">
      <SimpleCell label="type" text={type} />
      <SimpleCell label="dates" text={`${startDate} - ${endDate}`} />
      <SimpleCell label="note" text={note} />
      <CreatedByCell label="createdBy" creator={creator} created={cerated} />
      <ActionsCell
        label="actions"
        editableHoliday={editable}
        holidaysId={holiday.get('id')}
        holiday={holiday}
        deleteHoliday={deleteHoliday}
        onEditHoliday={onEditHoliday}
      />
    </div>
  )
}

const Header = () => {
  return (
    <div className="boss-table__row">
      <div className="boss-table__cell boss-table__cell_role_header">Types</div>
      <div className="boss-table__cell boss-table__cell_role_header">Dates</div>
      <div className="boss-table__cell boss-table__cell_role_header">Note</div>
      <div className="boss-table__cell boss-table__cell_role_header">Created By</div>
      <div className="boss-table__cell boss-table__cell_role_header">Action</div>
    </div>
  )
}


const HolidaysTableDesktop = ({holidays, deleteHoliday, onEditHoliday}) => {

  const renderHolidays = (holidays) => {
    return holidays.map(holiday => {
      return <Row key={holiday.get('id')} holiday={holiday} deleteHoliday={deleteHoliday} onEditHoliday={onEditHoliday}/>
    })
  }

  return (
    <div className="boss-table boss-table_page_smp-holidays">
      <Header />
      { renderHolidays(holidays) }
    </div>
  )
}

const HolidaysTable = ({holidays, deleteHoliday, onEditHoliday}) => {
  return (
    <div className="boss-board__manager-table">
      <HolidaysTableDesktop holidays={holidays} deleteHoliday={deleteHoliday} onEditHoliday={onEditHoliday} />
    </div>
  )
}

export default HolidaysTable;
