import React from 'react';
import BossDateRangePicker from '~/components/react-dates/boss-date-range-picker';
import AsyncButton from 'react-async-button';
import oFetch from 'o-fetch';
import utils from "~/lib/utils";

class HolidaysFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: oFetch(props, 'startDate'),
      endDate: oFetch(props, 'endDate'),
      startPayslipDate: oFetch(props, 'startPayslipDate'),
      endPayslipDate: oFetch(props, 'endPayslipDate'),
    };
  }

  onDatesChange = ({ startDate, endDate }) => {
    this.setState({
      startDate: startDate,
      endDate: endDate,
    });
  };

  onPayslipDatesChange = ({ startDate, endDate }) => {
    this.setState({
      startPayslipDate: startDate,
      endPayslipDate: endDate,
    });
  };

  onUpdate = () => {
    const { startDate, endDate, startPayslipDate, endPayslipDate } = this.state;
    const formatedStartDate = startDate && startDate.format(utils.apiDateFormat);
    const formatedEndDate = endDate && endDate.format(utils.apiDateFormat);
    const formatedStartPayslipDate = startPayslipDate && startPayslipDate.format(utils.apiDateFormat);
    const formatedEndPayslipDate = endPayslipDate && endPayslipDate.format(utils.apiDateFormat);
    return this.props.filter(formatedStartDate, formatedEndDate, formatedStartPayslipDate, formatedEndPayslipDate);
  };

  render() {
    const {
      startDate,
      endDate,
      startPayslipDate,
      endPayslipDate,
    } = this.state;

    return (
      <div className="boss-board__manager-filter">
        <div className="boss-form">
          <div className="boss-form__group boss-form__group_position_last">
            <h3 className="boss-form__group-title">Filter</h3>
          </div>
          <div className="boss-form__row boss-form__row_align_center boss-form__row_desktop boss-form__row_position_last">
            <div className="boss-form__field boss-form__field_layout_quarter">Date: </div>
            <div className="boss-form__field boss-form__field_layout_max boss-form__field_no-label">
              <div className="date-control date-control_type_icon date-control_type_interval-fluid date-range-picker_no-label">
                <BossDateRangePicker
                  startDateId="startDate"
                  endDateId="endDate"
                  startDate={startDate}
                  endDate={endDate}
                  onApply={this.onDatesChange}
                />
              </div>
            </div>
            <div className="boss-form__field boss-form__field_layout_min boss-form__field_no-label">
              <div style={{ width: '91px' }} />
            </div>
          </div>
          <div className="boss-form__row boss-form__row_align_center boss-form__row_desktop boss-form__row_position_last">
            <div className="boss-form__field boss-form__field_layout_quarter">Payslip Date: </div>
            <div className="boss-form__field boss-form__field_layout_max boss-form__field_no-label">
              <div className="date-control date-control_type_icon date-control_type_interval-fluid date-range-picker_no-label">
                <BossDateRangePicker
                  startDateId="startPayslipDate"
                  endDateId="endPayslipDate"
                  startDate={startPayslipDate}
                  endDate={endPayslipDate}
                  onApply={this.onPayslipDatesChange}
                />
              </div>
            </div>
            <div className="boss-form__field boss-form__field_layout_min boss-form__field_no-label">
              <AsyncButton
                className="boss-button boss-form__submit"
                text="Update"
                pendingText="Updating..."
                onClick={this.onUpdate}
              />
            </div>
          </div>
          <div className="boss-form__row boss-form__row_mobile boss-form__row_position_last">
            <div className="boss-form__field boss-form__field_layout_quarter">
              <p className="boss-form__label">Date: </p>
            </div>
            <div className="boss-form__field boss-form__field_layout_max">
              <div className="date-control date-control_type_icon date-control_type_interval-fluid date-range-picker_no-label">
                <BossDateRangePicker
                  startDateId="startDate"
                  endDateId="endDate"
                  startDate={startDate}
                  endDate={endDate}
                  onApply={this.onDatesChange}
                />
              </div>
            </div>
          </div>
          <div className="boss-form__row boss-form__row_mobile boss-form__row_position_last">
            <div className="boss-form__field boss-form__field_layout_quarter">
              <p className="boss-form__label">Payslip Date: </p>
            </div>
            <div className="boss-form__field boss-form__field_layout_max">
              <div className="date-control date-control_type_icon date-control_type_interval-fluid date-range-picker_no-label">
                <BossDateRangePicker
                  startDateId="startPayslipDate"
                  endDateId="endPayslipDate"
                  startDate={startPayslipDate}
                  endDate={endPayslipDate}
                  onApply={this.onPayslipDatesChange}
                />
              </div>
            </div>
            <div className="boss-form__field boss-form__field_layout_max boss-form__field_no-label">
              <AsyncButton
                className="boss-button boss-form__submit"
                text="Update"
                pendingText="Updating..."
                onClick={this.onUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HolidaysFilter;
