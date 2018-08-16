import React from 'react';
import { DateRangePicker } from 'react-dates';
import AsyncButton from 'react-async-button';
import oFetch from 'o-fetch';

class OwedHoursFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      focusedInputDate: null,
      focusedInputPayslipDate: null,
      startDate: oFetch(props, 'startDate'),
      endDate: oFetch(props, 'endDate'),
      payslipStartDate: oFetch(props, 'payslipStartDate'),
      payslipEndDate: oFetch(props, 'payslipEndDate'),
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
      payslipStartDate: startDate,
      payslipEndDate: endDate,
    });
  };

  onUpdate = () => {
    const { startDate, endDate, payslipStartDate, payslipEndDate } = this.state;
    if (startDate && endDate) {
      const formatedStartDate = startDate.format('DD-MM-YYYY');
      const formatedEndDate = endDate.format('DD-MM-YYYY');
      const formatedStartPayslipDate = payslipStartDate && payslipStartDate.format('DD-MM-YYYY');
      const formatedEndPayslipDate = payslipEndDate && payslipEndDate.format('DD-MM-YYYY');
      return this.props.filter(formatedStartDate, formatedEndDate, formatedStartPayslipDate, formatedEndPayslipDate);
    }
  };

  render() {
    const {
      focusedInputDate,
      focusedInputPayslipDate,
      startDate,
      endDate,
      payslipStartDate,
      payslipEndDate,
    } = this.state;

    return (
      <div className="boss-board__manager-group boss-board__manager-group_role_data boss-board__manager-group_context_stack">
        <div className="boss-board__manager-filter">
          <div className="boss-form">
            <div className="boss-form__group boss-form__group_position_last">
              <h3 className="boss-form__group-title">Filter</h3>
            </div>
            <div className="boss-form__row boss-form__row_align_center boss-form__row_desktop boss-form__row_position_last">
              <div className="boss-form__field boss-form__field_layout_quarter">Date: </div>
              <div className="boss-form__field boss-form__field_layout_max boss-form__field_no-label">
                <div className="date-range-picker date-range-picker_type_interval-fluid date-range-picker_type_icon date-range-picker_no-label">
                  <DateRangePicker
                    numberOfMonths={1}
                    withPortal
                    showClearDates
                    isOutsideRange={() => false}
                    displayFormat={'DD-MM-YYYY'}
                    startDate={startDate}
                    keepOpenOnDateSelect={false}
                    endDate={endDate}
                    onDatesChange={this.onDatesChange}
                    focusedInput={focusedInputDate}
                    onFocusChange={focusedInput => this.setState({ focusedInputDate: focusedInput })}
                    startDateId="startDate"
                    endDateId="endDate"
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
                <div className="date-range-picker date-range-picker_type_interval-fluid date-range-picker_type_icon date-range-picker_no-label">
                  <DateRangePicker
                    numberOfMonths={1}
                    withPortal
                    showClearDates
                    isOutsideRange={() => false}
                    displayFormat={'DD-MM-YYYY'}
                    startDate={payslipStartDate}
                    keepOpenOnDateSelect={false}
                    endDate={payslipEndDate}
                    onDatesChange={this.onPayslipDatesChange}
                    focusedInput={focusedInputPayslipDate}
                    onFocusChange={focusedInput => this.setState({ focusedInputPayslipDate: focusedInput })}
                    startDateId="payslipStartDate"
                    endDateId="payslipEndDate"
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
                <div className="date-range-picker date-range-picker_type_interval-fluid date-range-picker_type_icon date-range-picker_no-label">
                  <DateRangePicker
                    numberOfMonths={1}
                    withPortal
                    showClearDates
                    isOutsideRange={() => false}
                    displayFormat={'DD-MM-YYYY'}
                    startDate={startDate}
                    keepOpenOnDateSelect={false}
                    endDate={endDate}
                    onDatesChange={this.onDatesChange}
                    focusedInput={focusedInputDate}
                    onFocusChange={focusedInput => this.setState({ focusedInputDate: focusedInput })}
                    startDateId="startDate"
                    endDateId="endDate"
                  />
                </div>
              </div>
            </div>
            <div className="boss-form__row boss-form__row_mobile boss-form__row_position_last">
              <div className="boss-form__field boss-form__field_layout_quarter">
                <p className="boss-form__label">Payslip Date: </p>
              </div>
              <div className="boss-form__field boss-form__field_layout_max">
                <div className="date-range-picker date-range-picker_type_interval-fluid date-range-picker_type_icon date-range-picker_no-label">
                  <DateRangePicker
                    numberOfMonths={1}
                    withPortal
                    showClearDates
                    isOutsideRange={() => false}
                    displayFormat={'DD-MM-YYYY'}
                    startDate={payslipStartDate}
                    keepOpenOnDateSelect={false}
                    endDate={payslipEndDate}
                    onDatesChange={this.onPayslipDatesChange}
                    focusedInput={focusedInputPayslipDate}
                    onFocusChange={focusedInput => this.setState({ focusedInputPayslipDate: focusedInput })}
                    startDateId="payslipStartDate"
                    endDateId="payslipEndDate"
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
      </div>
    );
  }
}

export default OwedHoursFilter;