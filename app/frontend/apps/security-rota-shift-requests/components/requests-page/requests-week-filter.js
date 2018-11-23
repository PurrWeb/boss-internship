import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import oFetch from 'o-fetch';
import safeMoment from '~/lib/safe-moment';
import { RadioGroup, Radio } from 'react-radio-group';
import { appRoutes } from '~/lib/routes';

export default class WeekFilter extends React.PureComponent {
  state = {
    weekday: this.props.date,
  };

  changeURLDate = date => {
    const mDate = safeMoment.uiDateParse(date);
    window.history.pushState(
      'state',
      'title',
      appRoutes.securityRotaShiftRequests({mStartDate: mDate}),
    );
  };

  handleFilterChange = value => {
    this.setState({ weekday: value });
    const { onChange } = this.props;
    if (value === 'All') {
    } else {
      this.changeURLDate(value);
    }
    onChange({ chosenDate: value });
  };

  renderWeekDays() {
    const { weekDates } = this.props;
    const week = weekDates.map((day, index) => {
      const weekday = day.weekDay;
      return (
        <label key={weekday} className="boss-form__switcher-label">
          <Radio value={day.date} className="boss-form__switcher-radio" />
          <span className="boss-form__switcher-label-text">{`${weekday} (${
              day.count
            })`}</span>
        </label>
      );
    });
    return week;
  }

  render() {
    return (
      <div className="boss-form__field boss-form__row_position_last">
        <RadioGroup
          name="weekFilter"
          selectedValue={this.state.weekday}
          onChange={this.handleFilterChange}
          className="boss-form__switcher boss-form__switcher_role_week"
        >
          {this.renderWeekDays()}
        </RadioGroup>
      </div>
    );
  }
}

WeekFilter.propTypes = {
  weekDates: PropTypes.array.isRequired,
  date: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};
