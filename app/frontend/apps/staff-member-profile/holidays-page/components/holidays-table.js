import React from 'react';
import humanize from 'string-humanize';
import pluralize from 'pluralize';
import oFetch from 'o-fetch';
import safeMoment from '~/lib/safe-moment';
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

const ActionsCell = ({
  label,
  holidaysId,
  holiday,
  deleteHoliday,
  onEditHoliday,
  editableHoliday,
  isStaffMemberDisabled,
  isEditable,
  isDeletable,
  isFrozen,
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
        {!isStaffMemberDisabled &&
          !isFrozen && (
            <p className="boss-table__actions">
              {isEditable && (
                <button
                  onClick={openEditHoliday}
                  className="boss-button boss-button_type_small boss-button_role_update boss-table__action"
                >
                  Edit
                </button>
              )}
              {isDeletable && (
                <button
                  onClick={() => onDelete(holiday)}
                  className="boss-button boss-button_type_small boss-button_role_cancel boss-table__action"
                >
                  Delete
                </button>
              )}
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

const Row = ({ holiday, deleteHoliday, onEditHoliday, isStaffMemberDisabled, permissionsData }) => {
  const jsHoliday = holiday.toJS();
  const id = oFetch(jsHoliday, 'id');
  const type = humanize(oFetch(jsHoliday, 'holiday_type'));
  const status = humanize(oFetch(jsHoliday, 'state'));
  const note = oFetch(jsHoliday, 'note') || '-';
  const creator = oFetch(jsHoliday, 'creator');
  const cerated = `(${safeMoment.iso8601Parse(oFetch(jsHoliday, 'created_at')).format('Do MMMM YYYY - HH:mm')})`;
  const editable = oFetch(jsHoliday, 'editable');
  const isFrozen = oFetch(jsHoliday, 'frozen');
  const payslipDate = oFetch(jsHoliday, 'payslip_date');

  const holidayDaysCount = utils.getDaysCountFromInterval(
    oFetch(jsHoliday, 'start_date'),
    oFetch(jsHoliday, 'end_date'),
  );

  const isEditable =
    oFetch(jsHoliday, 'type') === 'holiday'
      ? oFetch(staffMemberProfileHolidaysPermissions, 'canEditHoliday')({ permissionsData: permissionsData, id: id })
      : oFetch(staffMemberProfileHolidaysPermissions, 'canEditHolidayRequest')({
          permissionsData: permissionsData,
          id: id,
        });
  const isDeletable =
    oFetch(jsHoliday, 'type') === 'holiday'
      ? oFetch(staffMemberProfileHolidaysPermissions, 'canDestroyHoliday')({ permissionsData: permissionsData, id: id })
      : oFetch(staffMemberProfileHolidaysPermissions, 'canDestroyHolidayRequest')({
          permissionsData: permissionsData,
          id: id,
        });

  const rowClass = classNames({
    'boss-table__row': true,
    'boss-table__row_state_frozen': isFrozen,
  });
  return (
    <div className={rowClass}>
      <SimpleCell label="type" text={`${holidayDaysCount} ${pluralize(type, holidayDaysCount)}`} />
      <SimpleCell label="status" text={status} classNames={statusClasses[oFetch(jsHoliday, 'state')]} />
      <SimpleCell label="dates" text={utils.formatDateForHoliday(holiday.toJS())} />
      <SimpleCell label="note" text={note} />
      <CreatedByCell label="createdBy" creator={creator} created={cerated} />
      <SimpleCell label="payslipDate" text={payslipDate} />
      <ActionsCell
        label="actions"
        isEditable={isEditable}
        isDeletable={isDeletable}
        isStaffMemberDisabled={isStaffMemberDisabled}
        holidaysId={oFetch(jsHoliday, 'id')}
        holiday={holiday}
        deleteHoliday={deleteHoliday}
        onEditHoliday={onEditHoliday}
        isFrozen={isFrozen}
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
      <div className="boss-table__cell boss-table__cell_role_header">Payslip Date</div>
      <div className="boss-table__cell boss-table__cell_role_header" />
    </div>
  );
};

const HolidaysTableDesktop = ({ holidays, deleteHoliday, onEditHoliday, isStaffMemberDisabled, permissionsData }) => {
  const renderHolidays = holidays => {
    return holidays.map(holiday => {
      return (
        <Row
          key={holiday.get('id')}
          isStaffMemberDisabled={isStaffMemberDisabled}
          holiday={holiday}
          permissionsData={permissionsData}
          deleteHoliday={deleteHoliday}
          onEditHoliday={onEditHoliday}
        />
      );
    });
  };

  return (
    <div className="boss-table boss-table_page_smp-holiday-requests">
      <Header />
      {renderHolidays(holidays)}
    </div>
  );
};

const HolidaysTable = ({ holidays, deleteHoliday, onEditHoliday, isStaffMemberDisabled, permissionsData }) => {
  return (
    <div className="boss-board__manager-table">
      <HolidaysTableDesktop
        holidays={holidays}
        isStaffMemberDisabled={isStaffMemberDisabled}
        deleteHoliday={deleteHoliday}
        onEditHoliday={onEditHoliday}
        permissionsData={permissionsData}
      />
    </div>
  );
};

export default HolidaysTable;
