import React from 'react';
import EditHolidayForm from './edit-holiday-content-form';
import safeMoment from "~/lib/safe-moment";
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
      holiday,
      onSubmit,
      buttonTitle,
    } = this.props;

    let holidayData = holiday.toJS();
    const payslipDate = oFetch(holidayData, 'payslip_date');
    const initialValues = {
      note: oFetch(holidayData, 'note'),
      startDate: safeMoment.uiDateParse(oFetch(holidayData, 'start_date')),
      endDate: safeMoment.uiDateParse(oFetch(holidayData, 'end_date')),
      payslipDate: payslipDate ? safeMoment.uiDateParse(payslipDate) : payslipDate,
      holidayType: oFetch(holidayData, 'holiday_type'),
      id: oFetch(holidayData, 'id')
    }

    return (
      <div className="boss-modal-window__form">
        <EditHolidayForm
          initialValues={initialValues}
          submission={onSubmit}
          buttonTitle={buttonTitle}
        />
      </div>
    )
  }
}

export default EditHolidayContent;
