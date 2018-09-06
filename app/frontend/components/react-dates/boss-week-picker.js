import React, { PureComponent } from 'react';
import DayPickerRangeControllerWrapper from './day-picker-range-controller-wrapper';
import PropTypes from 'prop-types';
import safeMoment from '~/lib/safe-moment';
import utils from '~/lib/utils';
import MonthElement from './month-element';
import CalendarInfo from './calendar-info';
import { START_DATE } from 'react-dates/constants';
import oFetch from 'o-fetch';

class BossWeekPicker extends PureComponent {
  constructor(props) {
    super(props);
    const selectionStartUIDate = oFetch(props, 'selectionStartUIDate');
    const selectionStartDate = safeMoment.uiDateParse(selectionStartUIDate).startOf('isoWeek');

    this.state = {
      focusedInput: START_DATE,
      startDate: selectionStartDate,
      endDate: selectionStartDate.clone().add(6, 'd'),
    };
  }
  onDatesChange = ({ startDate, endDate }) => {
    this.setState({ startDate, endDate });
  };

  onFocusChange = focusedInput => {
    this.setState({
      // Force the focusedInput to always be truthy so that dates are always selectable
      focusedInput: !focusedInput ? START_DATE : focusedInput,
    });
  };

  handleApplyChanges = () => {
    const [startDate, endDate] = oFetch(this.state, 'startDate', 'endDate');
    const selectionStartUIDate = oFetch(this.props, 'selectionStartUIDate');


    if (!startDate || !endDate) {
      return;
    }
    const startUIDate = startDate.format(utils.commonDateFormat);
    const endUIDate = endDate.format(utils.commonDateFormat);

    // if it is the same week
    if (startUIDate === selectionStartUIDate) {
      return this.handleCancelChanges();
    }

    const returnFn = oFetch(this.props, 'onChange')({ startUIDate, endUIDate });
    this.setState({
      startDate,
      endDate,
    });
    if (returnFn && typeof returnFn.then === 'function') {
      return returnFn;
    }
  };

  handleCancelChanges = () => {
    const selectionStartUIDate = oFetch(this.props, 'selectionStartUIDate');
    const selectionStartDate = safeMoment.uiDateParse(selectionStartUIDate).startOf('isoWeek');
    this.setState(
      {
        startDate: selectionStartDate,
        endDate: selectionStartDate.clone().add(6, 'd'),
      },
      () => oFetch(this.props, 'onCancelClick')(),
    );
  };

  renderMonthElement = ({ month, onMonthSelect, onYearSelect }) => {
    return <MonthElement month={month} onMonthSelect={onMonthSelect} onYearSelect={onYearSelect} />;
  };

  renderCalendarInfo = () => (
    <CalendarInfo
      startDate={this.state.startDate}
      endDate={this.state.endDate}
      onCancel={this.handleCancelChanges}
      onApply={this.handleApplyChanges}
    />
  );

  render() {
    const [focusedInput, startDate, endDate] = oFetch(this.state, 'focusedInput', 'startDate', 'endDate');
    return (
      <DayPickerRangeControllerWrapper
        onDatesChange={this.onDatesChange}
        onFocusChange={this.onFocusChange}
        focusedInput={focusedInput}
        startDate={startDate}
        endDate={endDate}
        renderMonthElement={this.renderMonthElement}
        renderCalendarInfo={this.renderCalendarInfo}
      />
    );
  }
}

BossWeekPicker.propTypes = {
  selectionStartUIDate: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onCancelClick: PropTypes.func.isRequired,
};

export default BossWeekPicker;
