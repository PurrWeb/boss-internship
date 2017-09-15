import React from 'react';
import AddHolidayContent from './add-holiday-content';

const AddHolidayModalContent = (props) => {
  return (
    <AddHolidayContent onSubmit={props.proceed} {...props} />
  )
}

export default AddHolidayModalContent;
