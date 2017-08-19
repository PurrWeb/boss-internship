import React from 'react';
import { DateRangePicker } from 'react-dates';
import AddHolidayContent from './add-holiday-content';

const AddNewHoliday = (props) => {
  return (
    <AddHolidayContent startDate={props.startDate} endDate={props.endDate} onSubmit={props.proceed} />
  )
}

export default AddNewHoliday;
