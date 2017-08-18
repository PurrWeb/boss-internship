import React from 'react';
import EditOwedHoursContent from './edit-owed-hours-content';

const EditNewOwedHours = (props) => {
  return (
    <EditOwedHoursContent owedHour={props.owedHour} onSubmit={props.proceed} />
  )
}

export default EditNewOwedHours;
