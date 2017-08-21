import React from 'react';
import { DateRangePicker } from 'react-dates';
import OwedHoursForm from './add-new-owed-hours-form';

class AddOwedHoursContent extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {


    return (
      <div>
        <OwedHoursForm/>
      </div>
    )
  }
}

export default AddOwedHoursContent;
