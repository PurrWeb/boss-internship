import React from 'react';
import EditHolidayForm from './edit-holiday-content-form';
import moment from 'moment';
import oFetch from "o-fetch";

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

    let holidayData = holiday.toJS();

    const initialValues = {
      note: oFetch(holidayData, 'note'),
      startDate: moment(oFetch(holiday, 'start_date'), 'DD-MM-YYYY'),
      endDate: moment(oFetch(holidayData, 'end_date'), 'DD-MM-YYYY'),
      holidaysType: HOLIDAYS_OPTIONS.find(item => item.value === oFetch(holidayData, 'holiday_type')),
      id: oFetch(holidayData, 'id')
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
