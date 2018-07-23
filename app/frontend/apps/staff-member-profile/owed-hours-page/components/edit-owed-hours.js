import React from 'react';
import EditOwedHoursForm from './edit-owed-hours-form';
import safeMoment from "~/lib/safe-moment";

const EditNewOwedHours = ({owedHour}) => {
  const initialValues = {
    note: owedHour.get('note'),
    startsAt: owedHour.getIn(['times' ,'startsAtOffset']),
    endsAt: owedHour.getIn(['times', 'endsAtOffset']),
    id: owedHour.get('id'),
    date: safeMoment.uiDateParse(owedHour.get('date')),
    payslipDate: safeMoment.uiDateParse(owedHour.get('payslipDate')),
  }

  return (
    <div className="boss-modal-window__form">
      <EditOwedHoursForm
        rotaDate={safeMoment.uiDateParse(owedHour.get('date'))}
        initialValues={initialValues}
      />
    </div>
  )
}

export default EditNewOwedHours;
