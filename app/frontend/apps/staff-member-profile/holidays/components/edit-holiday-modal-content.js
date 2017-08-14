import React from 'react';
import { DateRangePicker } from 'react-dates';
import EditHolidayContent from './edit-holiday-content';

const EditHolidayModalContent = (props) => {
  return (
    <EditHolidayContent onSubmit={props.proceed} {...props} />
  )
}

export default EditHolidayModalContent;
