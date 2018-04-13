import React from 'react';
import humanize from 'string-humanize';
import safeMoment from '~/lib/safe-moment';
import confirm from '~/lib/confirm-utils';

const PENDING_STATUS = 'pending';
const ACCEPTED_STATUS = 'accepted';
const REJECTED_STATUS = 'rejected';

const statusClasses = {
  [PENDING_STATUS]: 'boss-table__text_role_pending-status',
  [ACCEPTED_STATUS]: 'boss-table__text_role_success-status',
  [REJECTED_STATUS]: 'boss-table__text_role_alert-status',
};

const ActionsCell = ({
  label,
  holidaysId,
  holiday,
  deleteHoliday,
  onEditHoliday,
  editableHoliday,
  isStaffMemberDisabled,
}) => {
  const openEditHoliday = () => {
    onEditHoliday(holiday);
  };

  const onDelete = holiday => {
    confirm('Are you sure ?', {
      title: 'Delete holiday',
      actionButtonText: 'Delete',
    }).then(() => {
      deleteHoliday(holiday);
    });
  };

  return (
    <div className="boss-table__cell">
      <div className="boss-table__info">
        <p className="boss-table__label">{label}</p>
        {editableHoliday &&
          !isStaffMemberDisabled && (
            <p className="boss-table__actions">
              <button
                onClick={openEditHoliday}
                className="boss-button boss-button_type_small boss-button_role_update boss-table__action"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(holiday)}
                className="boss-button boss-button_type_small boss-button_role_cancel boss-table__action"
              >
                Delete
              </button>
            </p>
          )}
      </div>
    </div>
  );
};

const SimpleCell = ({ label, text, classNames }) => {
  return (
    <div className="boss-table__cell">
      <div className="boss-table__info">
        <p className="boss-table__label">{label}</p>
        <p className={`boss-table__text ${classNames}`}>{text}</p>
      </div>
    </div>
  );
};

const CreatedByCell = ({ label, creator, created }) => {
  return (
    <div className="boss-table__cell">
      <div className="boss-table__info">
        <p className="boss-table__label">{label}</p>
        <p className="boss-table__text">
          <span className="boss-table__text-line">{creator}</span>
          <span className="boss-table__text-meta">{created}</span>
        </p>
      </div>
    </div>
  );
};

const Row = ({ holiday, deleteHoliday, onEditHoliday, isStaffMemberDisabled }) => {
  const type = humanize(holiday.get('holiday_type'));
  const status = humanize(holiday.get('state'));
  const startDate = safeMoment.uiDateParse(holiday.get('start_date')).format('DD MMM YYYY');
  const endDate = safeMoment.uiDateParse(holiday.get('end_date')).format('DD MMM YYYY');
  const note = holiday.get('note') || '-';
  const creator = holiday.get('creator');
  const cerated = `(${safeMoment.iso8601Parse(holiday.get('created_at')).format('Do MMMM YYYY - HH:mm')})`;
  const editable = holiday.get('editable');

  return (
    <div className="boss-table__row">
      <SimpleCell label="type" text={type} />
      <SimpleCell label="status" text={status} classNames={statusClasses[holiday.get('state')]} />
      <SimpleCell label="dates" text={`${startDate} - ${endDate}`} />
      <SimpleCell label="note" text={note} />
      <CreatedByCell label="createdBy" creator={creator} created={cerated} />
      <ActionsCell
        label="actions"
        editableHoliday={editable}
        isStaffMemberDisabled={isStaffMemberDisabled}
        holidaysId={holiday.get('id')}
        holiday={holiday}
        deleteHoliday={deleteHoliday}
        onEditHoliday={onEditHoliday}
      />
    </div>
  );
};

const Header = () => {
  return (
    <div className="boss-table__row">
      <div className="boss-table__cell boss-table__cell_role_header">Types</div>
      <div className="boss-table__cell boss-table__cell_role_header">Status</div>
      <div className="boss-table__cell boss-table__cell_role_header">Dates</div>
      <div className="boss-table__cell boss-table__cell_role_header">Note</div>
      <div className="boss-table__cell boss-table__cell_role_header">Created By</div>
      <div className="boss-table__cell boss-table__cell_role_header">Action</div>
    </div>
  );
};

const HolidaysTableDesktop = ({ holidays, deleteHoliday, onEditHoliday, isStaffMemberDisabled }) => {
  const renderHolidays = holidays => {
    return holidays.map(holiday => {
      return (
        <Row
          key={holiday.get('id')}
          isStaffMemberDisabled={isStaffMemberDisabled}
          holiday={holiday}
          deleteHoliday={deleteHoliday}
          onEditHoliday={onEditHoliday}
        />
      );
    });
  };

  return (
    <div className="boss-table boss-table_page_smp-holidays">
      <Header />
      {renderHolidays(holidays)}
    </div>
  );
};

const HolidaysTable = ({ holidays, deleteHoliday, onEditHoliday, isStaffMemberDisabled }) => {
  return (
    <div className="boss-board__manager-table">
      <HolidaysTableDesktop
        holidays={holidays}
        isStaffMemberDisabled={isStaffMemberDisabled}
        deleteHoliday={deleteHoliday}
        onEditHoliday={onEditHoliday}
      />
    </div>
  );
};

export default HolidaysTable;
