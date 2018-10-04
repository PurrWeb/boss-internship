import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import omit from 'lodash/omit';
import oFetch from 'o-fetch';

import utils from '~/lib/utils';
import { DayPickerRangeController } from 'react-dates';

import ScrollableOrientationShape from 'react-dates/lib/shapes/ScrollableOrientationShape';

import { HORIZONTAL_ORIENTATION } from 'react-dates/constants';

class DayPickerRangeControllerWrapper extends React.PureComponent {
  isOutsideRange = () => false;

  startDateOffset = day => day.startOf('isoWeek');
  endDateOffset = day => day.endOf('isoWeek');

  render() {
    const [showInputs, focusedInput, startDate, endDate] = oFetch(
      this.props,
      'showInputs',
      'focusedInput',
      'startDate',
      'endDate',
    );

    const props = omit(this.props, [
      'autoFocus',
      'autoFocusEndDate',
      'initialStartDate',
      'initialEndDate',
      'showInputs',
    ]);

    const startDateString = startDate && startDate.format(utils.commonDateFormat);
    const endDateString = endDate && endDate.format(utils.commonDateFormat);

    return (
      <div style={{ height: '100%' }}>
        {showInputs && (
          <div style={{ marginBottom: 16 }}>
            <input type="text" name="start date" value={startDateString} readOnly />
            <input type="text" name="end date" value={endDateString} readOnly />
          </div>
        )}

        <DayPickerRangeController
          {...props}
          onDatesChange={this.props.onDatesChange}
          onFocusChange={this.props.onFocusChange}
          focusedInput={focusedInput}
          startDate={startDate}
          endDate={endDate}
          weekDayFormat="ddd"
          hideKeyboardShortcutsPanel
          numberOfMonths={1}
          firstDayOfWeek={1}
          startDateOffset={this.startDateOffset}
          endDateOffset={this.endDateOffset}
          isOutsideRange={this.isOutsideRange}
        />
      </div>
    );
  }
}

DayPickerRangeControllerWrapper.propTypes = {
  onDatesChange: PropTypes.func.isRequired,
  onFocusChange: PropTypes.func.isRequired,
  focusedInput: PropTypes.string,
  startDate: PropTypes.instanceOf(moment).isRequired,
  endDate: PropTypes.instanceOf(moment).isRequired,

  // example props for the demo
  autoFocusEndDate: PropTypes.bool,
  initialStartDate: PropTypes.instanceOf(moment),
  initialEndDate: PropTypes.instanceOf(moment),
  startDateOffset: PropTypes.func,
  endDateOffset: PropTypes.func,
  showInputs: PropTypes.bool,

  keepOpenOnDateSelect: PropTypes.bool,
  minimumNights: PropTypes.number,
  isOutsideRange: PropTypes.func,
  isDayBlocked: PropTypes.func,
  isDayHighlighted: PropTypes.func,

  // DayPicker props
  enableOutsideDays: PropTypes.bool,
  numberOfMonths: PropTypes.number,
  orientation: ScrollableOrientationShape,
  verticalHeight: PropTypes.number,
  withPortal: PropTypes.bool,
  initialVisibleMonth: PropTypes.func,
  renderCalendarInfo: PropTypes.func,
  renderMonthElement: PropTypes.func,
  renderMonthText: PropTypes.func,

  navPrev: PropTypes.node,
  navNext: PropTypes.node,

  onPrevMonthClick: PropTypes.func,
  onNextMonthClick: PropTypes.func,
  onOutsideClick: PropTypes.func,
  renderCalendarDay: PropTypes.func,
  renderDayContents: PropTypes.func,

  // i18n
  monthFormat: PropTypes.string,

  isRTL: PropTypes.bool,
};
DayPickerRangeControllerWrapper.defaultProps = {
  // example props for the demo
  autoFocusEndDate: false,
  initialStartDate: null,
  initialEndDate: null,
  startDateOffset: undefined,
  endDateOffset: undefined,
  showInputs: false,

  // day presentation and interaction related props
  renderCalendarDay: undefined,
  renderDayContents: null,
  minimumNights: 1,
  isDayBlocked: () => false,
  isOutsideRange: () => false,
  isDayHighlighted: () => false,
  enableOutsideDays: false,

  // calendar presentation and interaction related props
  orientation: HORIZONTAL_ORIENTATION,
  verticalHeight: undefined,
  withPortal: false,
  initialVisibleMonth: null,
  numberOfMonths: 1,
  onOutsideClick() {},
  keepOpenOnDateSelect: false,
  renderCalendarInfo: null,
  isRTL: false,
  renderMonthText: null,
  renderMonthElement: null,

  // navigation related props
  navPrev: null,
  navNext: null,
  onPrevMonthClick() {},
  onNextMonthClick() {},

  // internationalization
  monthFormat: 'MMMM YYYY',
};

export default DayPickerRangeControllerWrapper;
