import React from 'react';
import EditHolidayContent from './edit-holiday-content';

const EditHoliday = (props) => {
  return (
    <EditHolidayContent holiday={props.holiday} onSubmit={props.proceed} />
  )
}

export default EditHoliday;
