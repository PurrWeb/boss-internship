import PropTypes from 'prop-types';
import React from 'react';
import RotaDate from '~/lib/rota-date';
import _ from 'underscore';
import safeMoment from '~/lib/safe-moment';
import convertClockInPeriodToIntervals from './convert-clock-in-period-to-intervals';
import HoursChartUi from './hours-chart-content';

export default class HoursChart extends React.Component {
  static propTypes = {
    clockedClockInPeriods: PropTypes.array.isRequired,
    rotaedShifts: PropTypes.array.isRequired,
    hoursAcceptancePeriods: PropTypes.array.isRequired,
    rotaDate: PropTypes.instanceOf(RotaDate).isRequired,
    clockInEvents: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      interactionState: {
        hoveredInterval: null,
      },
    };
  }

  render() {
    return (
      <HoursChartUi
        clockedIntervals={this.getClockedChartIntervals()}
        hoursAcceptanceIntervals={this.getHoursAcceptanceIntervals()}
        rotaedIntervals={this.getRotaedChartIntervals()}
        events={this.getEventsList()}
        interactionState={this.state.interactionState}
        onHoveredIntervalChange={hoveredInterval =>
          this.setInteractionState({ hoveredInterval })
        }
      />
    );
  }

  getEventsList() {
    return this.props.clockInEvents.map(event => {
      return {
        timeOffset: this.getHoursSinceStartOfDay(event.at),
        type: event.eventType,
      };
    });
  }

  setInteractionState(interactionState) {
    this.setState({
      interactionState: Object.assign(
        {},
        this.state.interactionState,
        interactionState,
      ),
    });
  }

  getHoursAcceptanceIntervals() {
    return this.getIntervalsFromClockInPeriodList(
      this.props.hoursAcceptancePeriods,
    );
  }

  getDateFromHoursOffset(hoursOffset) {
    var date = new Date(this.props.rotaDate.startTime);
    date.setMinutes(date.getMinutes() + hoursOffset * 60);
    return date;
  }

  getRotaedChartIntervals() {
    return this.props.rotaedShifts.map(shift => {
      var label =
        safeMoment.iso8601Parse(shift.startsAt).format('HH:mm') +
        ' - ' +
        safeMoment.iso8601Parse(shift.endsAt).format('HH:mm');

      return {
        startOffsetInHours: this.getHoursSinceStartOfDay(shift.startsAt),
        endOffsetInHours: this.getHoursSinceStartOfDay(shift.endsAt),
        label,
        type: 'rotaed',
      };
    });
  }

  getHoursSinceStartOfDay(date) {
    return this.props.rotaDate.getHoursSinceStartOfDay(
      safeMoment.iso8601Parse(date).toDate(),
    );
  }

  getIntervalsFromClockInPeriodList(clockInList) {
    var clockedIntervals = [];
    clockInList.forEach(clockIn => {
      clockedIntervals = clockedIntervals.concat(
        convertClockInPeriodToIntervals(clockIn, this.props.clockInBreaks),
      );
    });
    var intervals = clockedIntervals.map(interval => {
      var startTime = interval.startsAt;
      var endTime = interval.endsAt;
      var tooltipLabel =
        safeMoment.iso8601Parse(startTime).format('HH:mm') +
        ' - ' +
        safeMoment.iso8601Parse(endTime).format('HH:mm');
      return {
        startOffsetInHours: this.getHoursSinceStartOfDay(startTime),
        endOffsetInHours: this.getHoursSinceStartOfDay(endTime),
        type: interval.type,
        tooltipLabel,
      };
    });

    return intervals;
  }
  getClockedChartIntervals() {
    return this.getIntervalsFromClockInPeriodList(
      this.props.clockedClockInPeriods,
    );
  }
}
