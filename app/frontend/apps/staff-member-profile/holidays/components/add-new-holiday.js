import React from 'react';
import { DateRangePicker } from 'react-dates';
import EditHolidayContent from './edit-holiday-content';

const AddNewHoliday = (props) => {
  return (
    <EditHolidayContent onSubmit={props.proceed} />
  )
}

export default AddNewHoliday;
