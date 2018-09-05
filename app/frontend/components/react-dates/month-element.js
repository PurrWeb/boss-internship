import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import oFetch from 'o-fetch';
import momentPropTypes from 'react-moment-proptypes';
import memoizeOne from 'memoize-one';

const renderMonthOptions = () =>
  moment.months().map((label, value) => (
    <option key={label} value={value}>
      {label}
    </option>
  ));

const renderYearOptions = (minYear, maxYear) => {
  const years = [];
  for (let i = minYear; i <= maxYear; i++) {
    years.push(i);
  }
  return years.map(year => (
    <option key={year} value={year}>
      {year}
    </option>
  ));
};

const memoizedRenderYearOptions = memoizeOne(renderYearOptions);

class MonthElement extends React.PureComponent {
  handleMonthChange = e => {
    oFetch(this.props, 'onMonthSelect')(this.props.month, e.target.value);
  };

  handleYearChange = e => {
    oFetch(this.props, 'onYearSelect')(this.props.month, e.target.value);
  };

  render() {
    const [month, minYear, maxYear] = oFetch(this.props, 'month', 'minYear', 'maxYear');
    return (
      <div className="CalendarMonth_selects">
        <div className="CalendarMonth_select">
          <select
            className="CalendarMonth_select-control CalendarMonth_select-control_month"
            value={month.month()}
            onChange={this.handleMonthChange}
          >
            {renderMonthOptions()}
          </select>
        </div>
        <div className="CalendarMonth_select">
          <select
            className="CalendarMonth_select-control CalendarMonth_select-control_year"
            value={month.year()}
            onChange={this.handleYearChange}
          >
            {memoizedRenderYearOptions(minYear, maxYear)}
          </select>
        </div>
      </div>
    );
  }
}

MonthElement.propTypes = {
  onMonthSelect: PropTypes.func.isRequired,
  onYearSelect: PropTypes.func.isRequired,
  month: momentPropTypes.momentObj,
  minYear: PropTypes.number,
  maxYear: PropTypes.number,
};

MonthElement.defaultProps = {
  minYear: 1920,
  maxYear: 2050,
};

export default MonthElement;
