import React from 'react';
import AddHolidayContent from './add-holiday-content';

const AddNewHoliday = (props) => {
  return (
    <AddHolidayContent buttonTitle={props.buttonTitle} startDate={props.startDate} endDate={props.endDate} onSubmit={props.onSubmit} />
  )
}

export default AddNewHoliday;
