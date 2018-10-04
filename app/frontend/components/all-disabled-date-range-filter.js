import React from 'react';
import BossDateRangePicker from '~/components/react-dates/boss-date-range-picker';
import {RadioGroup, Radio} from 'react-radio-group';

class AllDisabledDateRangeFilter extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      startDate: props.startDate,
      endDate: props.endDate,
    }
  }
  
  onDatesChange = ({startDate, endDate}) => {
    this.setState({
      startDate: startDate,
      endDate: endDate,
    });

    if (startDate && endDate) {
      let queryParams = new URLSearchParams(window.location.search);
      queryParams.set('start_date', startDate.format('DD-MM-YYYY'));
      queryParams.set('end_date', endDate.format('DD-MM-YYYY'));
      const link = `${window.location.href.split('?')[0]}?${queryParams.toString()}`;
      window.location.href = link;
    }
  }

  handleStatusChange = (value) => {
    let queryParams = new URLSearchParams(window.location.search);
    queryParams.set('status', value);
    const link = `${window.location.href.split('?')[0]}?${queryParams.toString()}`;
    window.location.href = link;
  }

  render() {
    const {
      selectedStatus,
      dateTitle,
    } = this.props;
    return (
      <div className="boss-page-main__filter">
        <div className="boss-form">
        <div className="boss-form__row boss-form__row_justify_space boss-form__row_position_last">
            <div className="boss-form__field boss-form__field_layout_min boss-form__field_role_control">
              <label className="boss-form__label boss-form__label_type_icon-date"><span className="boss-form__label-text">{dateTitle}</span></label>
              <div className="date-control date-control_adjust_control">
                <BossDateRangePicker
                  startDateId="startDate"
                  endDateId="endDate"
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  onApply={this.onDatesChange}
                  showClearDates={false}
                />
              </div>
            </div>
            <div className="boss-form__field boss-form__field_layout_fluid">
              <RadioGroup name="filter" selectedValue={selectedStatus} onChange={this.handleStatusChange} className="boss-form__switcher">
                <label className="boss-form__switcher-label">
                  <Radio value="active" className="boss-form__switcher-radio" />
                  <span className="boss-form__switcher-label-text">Active</span>
                </label>
                <label className="boss-form__switcher-label">
                  <Radio value="all" className="boss-form__switcher-radio" />
                  <span className="boss-form__switcher-label-text">Show All</span>
                </label>
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AllDisabledDateRangeFilter;
