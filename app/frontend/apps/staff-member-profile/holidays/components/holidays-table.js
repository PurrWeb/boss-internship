import React from 'react';
import humanize from 'string-humanize';
import moment from 'moment';
import editHolidayModal from '~/lib/content-modal';
import EditHolidayModalContent from './edit-holiday-modal-content';

const ActionsCell = ({label}) => {
  
  const openEditHoliday = () => {
    editHolidayModal(null, {
      title: 'Edit Holiday',
      component: EditHolidayModalContent,
    }).then((resp) => {
      // onUpdateAvatar(staffMember.get('id'), resp);
    });
  }

  return (
    <div className="boss-table__cell">
      <div className="boss-table__info">
        <p className="boss-table__label">{label}</p>
        <p className="boss-table__actions">
          <button
            onClick={openEditHoliday}
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

const Row = ({holiday}) => {
  const type = humanize(holiday.get('holiday_type'));
  const startDate = moment(holiday.get('start_date')).format('DD MMM YYYY');
  const endDate = moment(holiday.get('end_date')).format('DD MMM YYYY');
  const note = holiday.get('note') || '-';
  const creator = holiday.get('creator');
  const cerated = `(${moment(holiday.get('created_at')).format('Do MMMM YYYY - HH:mm')})`;

  return (
    <div className="boss-table__row">
      <SimpleCell label="type" text={type} />
      <SimpleCell label="dates" text={`${startDate} - ${endDate}`} />
      <SimpleCell label="note" text={note} />
      <CreatedByCell label="createdBy" creator={creator} created={cerated} />
      <ActionsCell label="actions" />
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


const HolidaysTableDesktop = ({holidays}) => {

  const renderHolidays = (holidays) => {
    return holidays.map(holiday => {
      return <Row key={holiday.get('id')} holiday={holiday} />
    })
  }

  return (
    <div className="boss-table boss-table_page_smp-holidays">
      <Header />
      { renderHolidays(holidays) }
    </div>
  )
}

const HolidaysTable = ({holidays}) => {
  return (
    <div className="boss-board__manager-table">
      <HolidaysTableDesktop holidays={holidays} />
    </div>
  )
}

export default HolidaysTable;
