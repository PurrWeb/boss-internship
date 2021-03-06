import React, { Component } from 'react';
import PropTypes from 'prop-types';
import safeMoment from '~/lib/safe-moment';
import moment from 'moment';
import utils from '~/lib/utils';
import { appRoutes } from "~/lib/routes";

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
    return <div className="boss-paginator boss-paginator_size_full">{this.renderTabList(week)}</div>;
  }

  renderTabList(week) {
    const highlightDate = safeMoment.uiDateParse(this.state.highlightDate);
    return week.map((item, index) => {
      const mCurrentDate = safeMoment.uiDateParse(item);

      const modifiedItem = safeMoment.uiDateParse(item);
      const tabClassName = highlightDate.isSame(modifiedItem, 'days') ? 'boss-paginator__action_state_active' : '';
      const formatedDate = highlightDate.isSame(modifiedItem, 'days')
        ? modifiedItem.format('D MMMM')
        : modifiedItem.format('D');

      return (
        <div key={index} className="boss-paginator__group">
          <button
            onClick={() => this.loadDayRota(item)}
            className={`boss-paginator__action boss-paginator__action_type_light ${tabClassName}`}
          >
            {formatedDate}
          </button>
          <div className="boss-paginator__meta">
            <a
              href={appRoutes.securityRotaShiftRequests({ mStartDate: mCurrentDate }) }
              className="boss-paginator__meta-link boss-paginator__meta-link_role_button-light"
            >
              Requests: {this.props.securityShiftRequestsCount[item]}
            </a>
          </div>
        </div>
      );
    });
  }

  loadDayRota = uiDate => {
    this.setState({
      highlightDate: uiDate,
    });
    this.props.onDateChange(uiDate);
  };

  render() {
    const { date } = this.props;
    const currentWeek = this.generateWeek(date);

    return <div className="boss-rotas__days-nav">{this.renderDays(currentWeek)}</div>;
  }
}

RotaWeekDays.propTypes = {
  date: PropTypes.string.isRequired,
  securityShiftRequestsCount: PropTypes.object,
};
export default RotaWeekDays;
