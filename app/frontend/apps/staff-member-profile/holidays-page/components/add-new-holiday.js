import React from 'react';
import AddHolidayContent from './add-holiday-content';

const AddNewHoliday = (props) => {
  return (
    <AddHolidayContent startDate={props.startDate} endDate={props.endDate} onSubmit={props.proceed} />
  )
}

export default AddNewHoliday;
