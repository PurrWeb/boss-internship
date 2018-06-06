import React from 'react';
import utils from "~/lib/utils";
import oFetch from 'o-fetch';
import { DateRangePicker } from 'react-dates';
import { PaymentFilterFilterTypeRadioGroup, defaultFilterValue } from './payment-filter-filter-type-radio-group';

export function queryParamValues(params){
  const mStartDate = oFetch(params, 'mStartDate');
  const mEndDate = oFetch(params, 'mEndDate');
  const statusFilter = oFetch(params, 'statusFilter');

  return {
    start_date: mStartDate.format(utils.apiDateFormat),
    end_date: mEndDate.format(utils.apiDateFormat),
    status_filter: statusFilter
  }
}

export class PaymentFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      focusedInput: null,
      mStartDate: oFetch(props, 'mStartDate'),
      mEndDate: oFetch(props, 'mEndDate'),
      statusFilter: oFetch(props, 'statusFilter')
    }
  }

  onUpdate() {
    oFetch(this.props, 'onUpdate')(this.state);
  }

  onDatesChange = (values) => {
    const mStartDate = oFetch(values, 'startDate');
    const mEndDate = oFetch(values, 'endDate');

    this.setState({
      mStartDate: mStartDate,
      mEndDate: mEndDate
    }, this.onUpdate);
  }

  onFilterTypeChange = (newValue) => {
    this.setState({
      statusFilter: newValue
    }, this.onUpdate);
  }

  render() {
    const [focusedInput, mStartDate, mEndDate, statusFilter] = oFetch(this.state, 'focusedInput', 'mStartDate', 'mEndDate', 'statusFilter');
    const requestInProgress = oFetch(this.props, 'requestInProgress');

    return <div className="boss-board__manager-filter">
			<div className="boss-form">
				<div className="boss-form__row boss-form__row_align_center boss-form__row_hidden-l">
					<div className="boss-form__field boss-form__field_role_control boss-form__field_layout_max">
						<p className="boss-form__label boss-form__label_type_light"><span className="boss-form__label-text">Filter</span></p>
						<div className="date-range-picker date-range-picker_type_interval date-range-picker_type_icon">
              <DateRangePicker
                readOnly={requestInProgress}
                numberOfMonths={1}
                withPortal
                showClearDates={false}
                isOutsideRange={() => false}
                displayFormat={"DD-MM-YYYY"}
                startDate={mStartDate}
                endDate={mEndDate}
                keepOpenOnDateSelect={false}
                onDatesChange={this.onDatesChange}
                focusedInput={focusedInput}
                onFocusChange={focusedInput => this.setState({ focusedInput })}
              />
						</div>
					</div>
          <PaymentFilterFilterTypeRadioGroup requestInProgress={requestInProgress} currentValue={this.state.statusFilter || defaultFilterValue} formFieldClass="boss-form__field_layout_min" onFilterTypeChange={this.onFilterTypeChange} />
				</div>
				<div className="boss-form__group boss-form__group_position_last boss-form__group_visible-l">
					<div className="boss-form__field">
						<p className="boss-form__label"><span className="boss-form__label-text">Filter</span></p>
						<div className="date-range-picker date-range-picker_type_interval-fluid date-range-picker_type_icon">
              <DateRangePicker
                readOnly={requestInProgress}
                numberOfMonths={2}
                withPortal
                showClearDates={false}
                isOutsideRange={() => false}
                displayFormat={"DD-MM-YYYY"}
                startDate={mStartDate}
                endDate={mEndDate}
                keepOpenOnDateSelect={false}
                onDatesChange={this.onDatesChange}
                focusedInput={focusedInput}
                onFocusChange={focusedInput => this.setState({ focusedInput })}
              />
						</div>
					</div>
					<div className="boss-form__field">
            <PaymentFilterFilterTypeRadioGroup requestInProgress={requestInProgress} currentValue={this.state.statusFilter || defaultFilterValue} onFilterTypeChange={this.onFilterTypeChange} />
          </div>
				</div>
			</div>
    </div>;
  }
}
