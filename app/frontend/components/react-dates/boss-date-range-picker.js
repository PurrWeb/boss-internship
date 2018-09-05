import React, { PureComponent } from 'react';
import { DateRangePicker } from 'react-dates';
import PropTypes from 'prop-types';
import moment from 'moment';
import utils from '~/lib/utils';
import oFetch from 'o-fetch';
import MonthElement from './month-element';
import CalendarInfo from './calendar-info';
import { START_DATE, END_DATE } from 'react-dates/constants';

class BossDateRangePicker extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      focusedInput: null,
      startDate: oFetch(props, 'startDate') || null,
      endDate: oFetch(props, 'endDate') || null,
    };
  }

  handleFocusChange = focusedInput => {
    // don't autoclose the datepicker
    if (focusedInput) {
      this.setState({ focusedInput });
    }
  };

  handleApplyChanges = () => {
    const { startDate, endDate } = this.state;

    if (!startDate || !endDate) {
      return;
    }
    const returnFn = oFetch(this.props, 'onApply')({ startDate, endDate });
    if (returnFn && typeof returnFn.then === 'function') {
      return returnFn.then(() => {
        this.setState({
          focusedInput: null,
        });
      });
    } else {
      this.setState({
        focusedInput: null,
      });
    }
  };

  handleCancelChanges = () => {
    this.setState({
      startDate: oFetch(this.props, 'startDate') || null,
      endDate: oFetch(this.props, 'endDate') || null,
      focusedInput: null,
    });
  };

  renderMonthElement = ({ month, onMonthSelect, onYearSelect }) => {
    return <MonthElement month={month} onMonthSelect={onMonthSelect} onYearSelect={onYearSelect} />;
  };

  renderCalendarInfo = () => (
    <CalendarInfo
      onCancel={this.handleCancelChanges}
      onApply={this.handleApplyChanges}
      startDate={this.state.startDate}
      endDate={this.state.endDate}
    />
  );

  isOutsideRange = () => false;

  initialVisibleMonth = () => {
    const [focusedInput, startDate, endDate] = oFetch(this.state, 'focusedInput', 'startDate', 'endDate');
    if (focusedInput === START_DATE && startDate) {
      return startDate;
    }
    if (focusedInput === END_DATE && endDate) {
      return endDate;
    }
    return moment();
  };

  handleDatesChange = ({ startDate, endDate }) => {
    // clear button clicked
    if (startDate === null && endDate === null) {
      oFetch(this.props, 'onApply')({ startDate, endDate });
    }
    this.setState({ startDate, endDate });
  };

  render() {
    const [startDateId, endDateId, numberOfMonths, isOutsideRange, readOnly, showClearDates] = oFetch(
      this.props,
      'startDateId',
      'endDateId',
      'numberOfMonths',
      'isOutsideRange',
      'readOnly',
      'showClearDates',
    );
    const [focusedInput, startDate, endDate] = oFetch(this.state, 'focusedInput', 'startDate', 'endDate');
    return (
      <DateRangePicker
        readOnly={readOnly}
        initialVisibleMonth={this.initialVisibleMonth}
        numberOfMonths={numberOfMonths}
        firstDayOfWeek={1}
        withPortal
        showClearDates={showClearDates}
        isOutsideRange={isOutsideRange || this.isOutsideRange}
        displayFormat={utils.commonDateFormat}
        startDate={startDate}
        endDate={endDate}
        onDatesChange={this.handleDatesChange}
        focusedInput={focusedInput}
        onFocusChange={this.handleFocusChange}
        startDateId={startDateId}
        endDateId={endDateId}
        renderMonthElement={this.renderMonthElement}
        renderCalendarInfo={this.renderCalendarInfo}
        hideKeyboardShortcutsPanel
        weekDayFormat="ddd"
      />
    );
  }
}

BossDateRangePicker.propTypes = {
  startDateId: PropTypes.string,
  endDateId: PropTypes.string,
  startDate: PropTypes.instanceOf(moment),
  endDate: PropTypes.instanceOf(moment),
  onApply: PropTypes.func.isRequired,
  numberOfMonths: PropTypes.number,
  isOutsideRange: PropTypes.func,
  readOnly: PropTypes.bool,
  showClearDates: PropTypes.bool,
};

BossDateRangePicker.defaultProps = {
  numberOfMonths: 1,
  isOutsideRange: null,
  readOnly: false,
  showClearDates: true,
  startDateId: 'startDateId',
  endDateId: 'endDateId',
};

export default BossDateRangePicker;
