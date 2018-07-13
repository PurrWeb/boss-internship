import React from 'react';
import PropTypes from 'prop-types';
import { RadioGroup, Radio } from 'react-radio-group';
import oFetch from 'o-fetch';

export default class WeekFilter extends React.PureComponent {
  state = {
    weekday: this.props.date,
  };

  changeURLDate = (date, venueId) => {
    window.history.pushState('state', 'title', `/security-shift-requests/${date}?venue_id=${venueId}`);
  };

  handleFilterChange = value => {
    const venueId = oFetch(this.props, 'venueId');
    this.setState({ weekday: value });
    const { onChange } = this.props;
    if (value !== 'All') {
      this.changeURLDate(value, venueId);
    }
    onChange({ chosenDate: value });
  };

  renderWeekDays() {
    const { weekDates } = this.props;
    const week = weekDates.map(day => {
      const weekday = day.weekDay;
      return (
        <label key={weekday} className="boss-form__switcher-label">
          <Radio value={day.date} className="boss-form__switcher-radio" />
          <span className="boss-form__switcher-label-text">{`${weekday} (${day.count})`}</span>
        </label>
      );
    });
    return week;
  }

  render() {
    return (
      <div className="boss-page-main__filter">
        <div className="boss-form">
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
        </div>
      </div>
    );
  }
}

WeekFilter.propTypes = {
  weekDates: PropTypes.array.isRequired,
  date: PropTypes.string.isRequired,
  venueId: PropTypes.number.isRequired,
  onChange: PropTypes.func,
};
