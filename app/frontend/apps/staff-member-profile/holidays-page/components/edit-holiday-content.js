import React from 'react';
import EditHolidayForm from './edit-holiday-content-form';
import moment from 'moment';

import {
  HOLIDAYS_OPTIONS
} from '../constants'

class EditHolidayContent extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      holiday
    } = this.props;

    const initialValues = {
      note: holiday.get('note'),
      startDate: moment(holiday.get('start_date'), 'DD-MM-YYYY'),
      endDate: moment(holiday.get('end_date'), 'DD-MM-YYYY'),
      holidaysType: HOLIDAYS_OPTIONS.find(item => item.value === holiday.get('holiday_type')),
      id: holiday.get('id')
    }

    return (
      <div className="boss-modal-window__form">
        <EditHolidayForm
          initialValues={initialValues}
        />
      </div>
    )
  }
}

export default EditHolidayContent;
