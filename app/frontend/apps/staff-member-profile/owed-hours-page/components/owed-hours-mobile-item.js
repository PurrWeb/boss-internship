import React from 'react';
import { openWarningModal } from '~/components/modals';
import { getOwedHourUIData } from './owed-hours-table';
import oFetch from 'o-fetch';

const OwedHourMobileItem = props => {
  const [owedHour, deleteOwedHours, openEditModal, isStaffMemberDisabled] = oFetch(
    props,
    'owedHour',
    'deleteOwedHours',
    'openEditModal',
    'isStaffMemberDisabled',
  );
  const onEdit = owedHour => {
    openEditModal(owedHour);
  };

  const onDelete = owedHourId => {
    openWarningModal({
      submit: hideModal => deleteOwedHours(owedHourId).then(hideModal),
      config: {
        title: 'Delete owed hours',
        text: 'Are You Sure?',
        buttonText: 'Delete',
      },
    });
  };

  const owedHourJS = owedHour.toJS();
  const [date, times, durationHours, durationMinutes, creator, created, note, editable, payslipDate, frozen] = oFetch(
    getOwedHourUIData(owedHourJS),
    'date',
    'times',
    'durationHours',
    'durationMinutes',
    'creator',
    'created',
    'note',
    'editable',
    'payslipDate',
    'frozen',
  );

  const duration = `${durationHours} hours ${durationMinutes} minutes`;
  const owedHourId = oFetch(owedHourJS, 'id');

  return (
    <div
      className={`boss-check boss-check_role_panel boss-check_page_smp-owed-hours ${
        frozen ? 'boss-check_state_frozen' : ''
      }`}
    >
      <div className="boss-check__row">
        <div className="boss-check__cell">
          <p className="boss-check__title">{date}</p>
        </div>
      </div>
      <div className="boss-check__row">
        <div className="boss-check__cell">
          <p className="boss-check__text boss-check__text_role_time boss-check__text_marked">
            <span>{times}&nbsp;</span>
            <span>({duration})</span>
          </p>
        </div>
      </div>
      <div className="boss-check__row">
        <div className="boss-check__cell">
          <p className="boss-check__text boss-check__text_role_user">
            <span className="boss-check__text-label">Created by: </span>
            {creator}
          </p>
          <p className="boss-check__text boss-check__text_role_secondary">{created}</p>
        </div>
      </div>
      {note !== '-' && (
        <div className="boss-check__row">
          <div className="boss-check__cell">
            <div className="boss-check__box">
              <p className="boss-check__text boss-check__text_role_note">{note}</p>
            </div>
          </div>
        </div>
      )}
      <div className="boss-check__row">
        <div className="boss-check__cell">
          <p className="boss-check__text boss-check__text_role_date">
            <span className="boss-check__text-label">Payslip Date: </span>
            {payslipDate}
          </p>
        </div>
      </div>
      {editable &&
        !isStaffMemberDisabled &&
        !frozen && (
          <div className="boss-check__row boss-check__row_role_actions">
            <button onClick={() => onEdit(owedHour)} className="boss-button boss-button_role_update boss-check__action">
              Edit
            </button>
            <button
              onClick={() => onDelete(owedHourId)}
              className="boss-button boss-button_role_cancel boss-check__action"
            >
              Delete
            </button>
          </div>
        )}
    </div>
  );
};

export default OwedHourMobileItem;
