import React from 'react';
import EditOwedHoursForm from './edit-owed-hours-form';
import moment from 'moment';

const EditNewOwedHours = ({owedHour}) => {
  const initialValues = {
    note: owedHour.get('note'),
    startsAt: owedHour.getIn(['times' ,'startsAtOffset']),
    endsAt: owedHour.getIn(['times', 'endsAtOffset']),
    id: owedHour.get('id'),
    date: moment(owedHour.get('date')),
  }

  return (
    <div className="boss-modal-window__form">
      <EditOwedHoursForm
        rotaDate={moment(owedHour.get('date'))}
        initialValues={initialValues}
      />
    </div>
  )
}

export default EditNewOwedHours;
