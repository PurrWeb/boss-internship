import React from 'react';
import AddOwedHoursContent from './add-new-owed-hours-content';

const AddNewOwedHours = (props) => {
  return (
    <AddOwedHoursContent onSubmit={props.proceed} />
  )
}

export default AddNewOwedHours;
