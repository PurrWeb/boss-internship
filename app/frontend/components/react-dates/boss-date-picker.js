import React, { PureComponent } from 'react';
import { SingleDatePicker } from 'react-dates';
import PropTypes from 'prop-types';
import moment from 'moment';
import utils from '~/lib/utils';
import MonthElement from './month-element';
import CalendarInfo from './calendar-info';
import oFetch from 'o-fetch';

class BossDatePicker extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      date: oFetch(props, 'date') || null,
    };
  }

  handleDateChange = date => {
    // clear button clicked
    if (date === null) {
      oFetch(this.props, 'onApply')(date);
    }
    this.setState({
      date,
    });
  };

  handleFocusChange = ({ focused }) => {
    // don't autoclose the datepicker
    if (focused) {
      this.setState({ focused });
    }
  };

  handleApplyChanges = () => {
    const { date } = this.state;

    if (!date) {
      return;
    }

    this.setState(
      {
        focused: false,
      },
      () => oFetch(this.props, 'onApply')(date),
    );
  };

  handleCancelChanges = () => {
    this.setState({
      date: oFetch(this.props, 'date') || null,
      focused: false,
    });
  };

  renderMonthElement = ({ month, onMonthSelect, onYearSelect }) => {
    return <MonthElement month={month} onMonthSelect={onMonthSelect} onYearSelect={onYearSelect} />;
  };

  renderCalendarInfo = () => (
    <CalendarInfo date={this.state.date} onCancel={this.handleCancelChanges} onApply={this.handleApplyChanges} />
  );

  isOutsideRange = () => false;

  render() {
    const [id, className, numberOfMonths, isOutsideRange, showClearDate] = oFetch(
      this.props,
      'id',
      'className',
      'numberOfMonths',
      'isOutsideRange',
      'showClearDate',
    );
    const [focused, date] = oFetch(this.state, 'focused', 'date');
    return (
      <div className={className}>
        <SingleDatePicker
          numberOfMonths={numberOfMonths}
          firstDayOfWeek={1}
          weekDayFormat="ddd"
          withPortal
          showClearDate={showClearDate}
          isOutsideRange={isOutsideRange || this.isOutsideRange}
          displayFormat={utils.commonDateFormat}
          date={date}
          onDateChange={this.handleDateChange}
          focused={focused}
          onFocusChange={this.handleFocusChange}
          id={id}
          renderMonthElement={this.renderMonthElement}
          renderCalendarInfo={this.renderCalendarInfo}
          hideKeyboardShortcutsPanel
        />
      </div>
    );
  }
}

BossDatePicker.propTypes = {
  id: PropTypes.string.isRequired,
  date: PropTypes.oneOfType([PropTypes.instanceOf(moment), PropTypes.string]),
  onApply: PropTypes.func.isRequired,
  className: PropTypes.string,
  numberOfMonths: PropTypes.number,
  isOutsideRange: PropTypes.func,
  showClearDate: PropTypes.bool,
};

BossDatePicker.defaultProps = {
  className: 'date-control date-control_type_icon',
  numberOfMonths: 1,
  isOutsideRange: null,
  showClearDate: false,
};

export default BossDatePicker;
