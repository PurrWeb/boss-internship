import React from 'react';
import moment from 'moment';
import {RadioGroup, Radio} from 'react-radio-group';
import URLSearchParams from 'url-search-params';

export default class HolidaysWeekFilter extends React.Component {

  constructor(props) {
    super(props);
    const queryString = new URLSearchParams(window.location.search);
    let weekday = queryString.get('weekday');
    weekday = (weekday > 0 && weekday <= 7) ? weekday : 0;
    this.state = {
      weekday: parseInt(weekday),
    }
  }

  handleFilterChange = (value) => {
    const queryString = new URLSearchParams(window.location.search);
    value === 0 ? queryString.delete('weekday') : queryString.set('weekday', value);
    const link = `${window.location.href.split('?')[0]}?${queryString.toString()}`
    window.location.href = link;
  }

  renderWeekDays() {
    const weekDaysCount = this.props.holidaysCount;
    let week = [];
    const allStaffMembersCount = this.props.staffMembersCount;
    for(let i = 1; i <= 7; i ++) {
      let weekday = moment().isoWeekday(i).format('dddd');
      let weekDayCount = weekDaysCount[i] || 0;
      let weekdayComponent = (
        <label key={weekday} className="boss-form__switcher-label">
          <Radio value={i} className="boss-form__switcher-radio" />
          <p className="boss-form__switcher-label-text">
            <span className="boss-table__text-line">{`${weekday} (${weekDayCount})`}</span>
          </p>
        </label>
      )
      week = [...week, weekdayComponent];
    }
    const allDaysComponent = (
      <label key="all" className="boss-form__switcher-label">
        <Radio value={0} className="boss-form__switcher-radio" />
        <p className="boss-form__switcher-label-text">
          <span className="boss-table__text-line">{`All (${allStaffMembersCount})`}</span>
        </p>
      </label>
    )
    return [...week, allDaysComponent];
  }

  render() {
    return (
      <div className="boss-form__field boss-form__row_position_last">
        <RadioGroup name="weekFilter" selectedValue={this.state.weekday} onChange={this.handleFilterChange} className="boss-form__switcher boss-form__switcher_role_week">
          {this.renderWeekDays()}
        </RadioGroup>
      </div>
    )
  }
}
