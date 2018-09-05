import React from 'react';
import utils from "~/lib/utils";
import oFetch from 'o-fetch';
import BossDateRangePicker from '~/components/react-dates/boss-date-range-picker';

import { PaymentFilterFilterTypeRadioGroup, defaultFilterValue } from './payment-filter-filter-type-radio-group';

export function queryParamValues(params) {
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
    const [mStartDate, mEndDate, statusFilter] = oFetch(this.state, 'mStartDate', 'mEndDate', 'statusFilter');
    const requestInProgress = oFetch(this.props, 'requestInProgress');

    return <div className="boss-board__manager-filter">
      <div className="boss-form">
        <div className="boss-form__row boss-form__row_align_center boss-form__row_hidden-l">
          <div className="boss-form__field boss-form__field_role_control boss-form__field_layout_max">
            <p className="boss-form__label boss-form__label_type_light"><span className="boss-form__label-text">Filter</span></p>
            <div className="date-control date-control_type_icon date-control_type_interval">
              <BossDateRangePicker
                readOnly={requestInProgress}
                startDateId="startDate"
                endDateId="endDate"
                startDate={mStartDate}
                endDate={mEndDate}
                onApply={this.onDatesChange}
                showClearDates={false}
              />
            </div>
          </div>
          <div className="boss-form__field boss-form__field_layout_min">
            <PaymentFilterFilterTypeRadioGroup
              className="boss-form__switcher"
              radioGroupName="payment-filter"
              requestInProgress={requestInProgress}
              currentValue={this.state.statusFilter || defaultFilterValue}
              onFilterTypeChange={this.onFilterTypeChange}
            />
          </div>
        </div>
        <div className="boss-form__group boss-form__group_position_last boss-form__group_visible-l">
          <div className="boss-form__field">
            <p className="boss-form__label"><span className="boss-form__label-text">Filter</span></p>
            <div className="date-control date-control_type_icon date-control_type_interval-fluid">
              <BossDateRangePicker
                readOnly={requestInProgress}
                startDateId="startDate"
                endDateId="endDate"
                startDate={mStartDate}
                endDate={mEndDate}
                onApply={this.onDatesChange}
                showClearDates={false}
              />
            </div>
          </div>
          <div className="boss-form__field">
            <PaymentFilterFilterTypeRadioGroup
              className="boss-form__switcher boss-form__switcher_layout_vertical-s"
              radioGroupName="payment-filter-mobile"
              requestInProgress={requestInProgress}
              currentValue={this.state.statusFilter || defaultFilterValue}
              onFilterTypeChange={this.onFilterTypeChange}
            />
          </div>
        </div>
      </div>
    </div>;
  }
}
