import React from 'react';
import { DateRangePicker } from 'react-dates';
import EditOwedHoursForm from './edit-owed-hours-form';
import moment from 'moment';

class EditOwedHoursContent extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {

    const {
      owedHour
    } = this.props;

    const initialValues = {
      note: owedHour.get('note'),
      startsAt: owedHour.get('startsAt'),
      endsAt: owedHour.get('endsAt'),
      id: owedHour.get('id'),
      date: moment(owedHour.get('date'), 'DD-MM-YYYY'),
    }


    return (
      <div>
        <EditOwedHoursForm
        initialValues={initialValues}
        />
      </div>
    )
  }
}

export default EditOwedHoursContent;
