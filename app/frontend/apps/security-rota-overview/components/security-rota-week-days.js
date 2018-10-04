import React, { Component } from 'react';
import PropTypes from 'prop-types';
import safeMoment from '~/lib/safe-moment';
import moment from 'moment';
import utils from '~/lib/utils';

class RotaWeekDays extends Component {
  state = {
    highlightDate: this.props.date,
  };

  generateWeek(startDate) {
    let startOfWeek = safeMoment.uiDateParse(startDate).startOf('isoweek');
    let endOfWeek = safeMoment.uiDateParse(startDate).endOf('isoweek');

    let days = [];
    let day = startOfWeek;

    while (day <= endOfWeek) {
      days.push(day.format(utils.commonDateFormat));
      day = day.clone().add(1, 'd');
    }
    return days;
  }

  renderDays(week) {
    return (
      <div className="boss-paginator boss-paginator_size_full">
        {this.renderTabList(week)}
      </div>
    );
  }

  renderTabList(week) {
    const highlightDate = safeMoment.uiDateParse(this.state.highlightDate);
    return week.map((item, index) => {
      const modifiedItem = safeMoment.uiDateParse(item);
      const tabClassName = highlightDate.isSame(modifiedItem, 'days')
        ? 'boss-paginator__action_state_active'
        : '';
      const formatedDate = highlightDate.isSame(modifiedItem, 'days')
        ? modifiedItem.format('D MMMM')
        : modifiedItem.format('D');

      return (
        <button
          key={index}
          onClick={() => this.loadDayRota(index, week)}
          className={`boss-paginator__action boss-paginator__action_type_light ${tabClassName}`}
        >
          {formatedDate}
        </button>
      );
    });
  }

  loadDayRota = (index, week) => {
    const date = week[index];
    const formatedDate = safeMoment.uiDateParse(date).format('DD-MM-YYYY');
    this.setState({
      highlightDate: date,
    });
    this.props.onDateChange(formatedDate);
  };

  render() {
    const { date } = this.props;
    const currentWeek = this.generateWeek(date);

    return (
      <div className="boss-rotas__days-nav">{this.renderDays(currentWeek)}</div>
    );
  }
}

RotaWeekDays.propTypes = {
  date: PropTypes.string.isRequired,
};
export default RotaWeekDays;
