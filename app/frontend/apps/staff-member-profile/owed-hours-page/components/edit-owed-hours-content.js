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
      startsAt: owedHour.getIn(['times' ,'startsAtOffset']),
      endsAt: owedHour.getIn(['times', 'endsAtOffset']),
      id: owedHour.get('id'),
      date: moment(owedHour.get('date')),
    }

    return (
      <div>
        <EditOwedHoursForm
          rotaDate={moment(owedHour.get('date'))}
          initialValues={initialValues}
        />
      </div>
    )
  }
}

export default EditOwedHoursContent;
