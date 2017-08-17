import React from 'react';
import { DateRangePicker } from 'react-dates';
import EditHolidayContent from './edit-holiday-content';

const AddNewHoliday = (props) => {
  return (
    <EditHolidayContent startDate={props.startDate} endDate={props.endDate} onSubmit={props.proceed} />
  )
}

export default AddNewHoliday;
