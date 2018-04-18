import React from 'react';
import EditHolidayContent from './edit-holiday-content';

const EditHoliday = (props) => {
  return (
    <EditHolidayContent holiday={props.holiday} buttonTitle={props.buttonTitle} onSubmit={props.onSubmit} />
  )
}

export default EditHoliday;
