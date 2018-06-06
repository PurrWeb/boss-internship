import React from 'react';
import humanize from 'string-humanize';
import safeMoment from "~/lib/safe-moment";
import confirm from '~/lib/confirm-utils';

import OwedHoursMobileItem from './owed-hours-mobile-item';

export const getOwedHourUIData = (owedHour) => {
  let hasDate = owedHour.get('hasDate');
  const date = safeMoment.uiDateParse(owedHour.get('date')).format('ddd DD MMM YYYY');
  let times = 'N/A';
  if (hasDate) {
    const startTime = safeMoment.iso8601Parse(owedHour.getIn(['times', 'startsAt'])).utcOffset(owedHour.getIn(['times', 'startsAt'])).format('HH:mm');
    const endTime = safeMoment.iso8601Parse(owedHour.getIn(['times', 'endsAt'])).utcOffset(owedHour.getIn(['times', 'endsAt'])).format('HH:mm');
    times = `${startTime} - ${endTime}`;
  }
  const durationHours = owedHour.getIn(['duration','hours']);
  const durationMinutes = owedHour.getIn(['duration', 'minutes']);
  const note = owedHour.get('note') || '-';
  const creator = owedHour.get('createdBy');
  const created = safeMoment.iso8601Parse(owedHour.get('createdAt')).utcOffset(owedHour.get('createdAt')).format('Do MMMM YYYY - HH:mm');
  const editable = owedHour.get('editable');
  const payslipDate = '20/11/2016!'; //HARDCODED, BACKEND INTEGRATION NEED
  return { hasDate, date, times, durationHours, durationMinutes, note, creator, created, editable, payslipDate };
}

const ActionsCell = ({
  label,
  owedHourId,
  deleteOwedHours,
  openEditModal,
  owedHour,
  editable,
  isStaffMemberDisabled,
}) => {

  const onEdit = (owedHour) => {
    openEditModal(owedHour);
  }
  
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
      { (editable && !isStaffMemberDisabled) && <div className="boss-table__info">
        <p className="boss-table__label">{label}</p>
        <p className="boss-table__actions">
          <button
            onClick={() => (onEdit(owedHour))}
            className="boss-button boss-button_type_small boss-button_role_update boss-table__action"
          >Edit</button>
          <button
            onClick={() => (onDelete(owedHourId))}
            className="boss-button boss-button_type_small boss-button_role_cancel boss-table__action"
          >Delete</button>
        </p>
      </div> }
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

const Row = ({owedHour, deleteOwedHours, openEditModal, isStaffMemberDisabled}) => {
  const {
    date,
    times,
    durationHours,
    durationMinutes,
    creator,
    created,
    note,
    editable,
    payslipDate,
  } = getOwedHourUIData(owedHour);

  return (
    <div className="boss-table__row">
      <SimpleCell label="Date" text={date} />
      <SimpleCell label="Times" text={times} />
      <SimpleCell label="Duration (hours)" text={durationHours} />
      <SimpleCell label="Duration (minutes)" text={durationMinutes} />      
      <CreatedByCell label="CreatedBy" creator={creator} created={created} />
      <SimpleCell label="Note" text={note} />
      <SimpleCell label="Payslip Date" text={payslipDate} />
      <ActionsCell
        editable={editable}
        label="Actions"
        owedHourId={owedHour.get('id')}
        deleteOwedHours={deleteOwedHours}
        openEditModal={openEditModal}
        owedHour={owedHour}
        isStaffMemberDisabled={isStaffMemberDisabled}
      />      
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
      <div className="boss-table__cell boss-table__cell_role_header">Payslip Date</div>
      <div className="boss-table__cell boss-table__cell_role_header"></div>
    </div>
  )
}

const OwedStats = ({week}) => {
  const startDate = safeMoment.uiDateParse(week.get('startDate')).format('ddd DD MMM YYYY');
  const endDate = safeMoment.uiDateParse(week.get('endDate')).format('ddd DD MMM YYYY');
  return (
    <div>
      <div className="boss-count boss-count_adjust_flow boss-count_type_solid">
        <p className="boss-count__label boss-count__label_role_date">{startDate} - {endDate}</p>
      </div>
      <div className="boss-count boss-count_adjust_flow boss-count_type_solid">
        <p className="boss-count__label boss-count__label_role_time">Total: {week.get('totalHours')}</p>
      </div>
    </div>
  )
};


const OwedHoursTable = ({owedHours, deleteOwedHours, openEditModal, isStaffMemberDisabled}) => {    
  const renderRows = (owedHours, deleteOwedHours, openEditModal) => {
    return owedHours.map(owedHour => {
      return <Row
        key={`${owedHour.get('id')}`}
        owedHour={owedHour}
        deleteOwedHours={deleteOwedHours}
        openEditModal={openEditModal}
        isStaffMemberDisabled={isStaffMemberDisabled}
      />
    });
  }

  const renderMobileItems = (owedHours, deleteOwedHours, openEditModal) => {
    return owedHours.map(owedHour => {
      return <OwedHoursMobileItem
        key={owedHour.get('id')}
        owedHour={owedHour}
        isStaffMemberDisabled={isStaffMemberDisabled}
        deleteOwedHours={deleteOwedHours}
        openEditModal={openEditModal}
      />;
    })
  }


  const renderOwedhours = (owedHours) => {

    return owedHours.map((owedHour, index) => {
      return (
        <div key={index} className="boss-board__manager-group boss-board__manager-group_context_stack">
          <div className="boss-board__manager-stats boss-board__manager-stats_role_group-header">
            <OwedStats week={owedHour.get('week')}/>
          </div>
          <div className="boss-board__manager-table">
            <div className="boss-table boss-table_page_smp-owed-hours">
              <Header />
              {renderRows(owedHour.get('owedHours'), deleteOwedHours, openEditModal)}
            </div>
            {renderMobileItems(owedHour.get('owedHours'), deleteOwedHours, openEditModal)}   
          </div>
        </div>
      )
    });
  }

  const hasOwedHours = !!owedHours.size;

  return (
    <div>
      { hasOwedHours
          ? renderOwedhours(owedHours)
          : <h1 className="boss-table__cell boss-table__cell_role_header">
              NO OWED HOURS FOUND
            </h1>
      }
    </div>
  )
}

export default OwedHoursTable;
