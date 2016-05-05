import React from "react"
import RotaDate from "~lib/rota-date"
import _ from "underscore"
import moment from "moment"
import convertClockInHoursToIntervals from "./convert-clock-in-hours-to-intervals"
import HoursChartUi from "./hours-chart-content"

export default class HoursChart extends React.Component {
    static propTypes = {
        clockedClockIns: React.PropTypes.array.isRequired,
        rotaedShifts: React.PropTypes.array.isRequired,
        proposedAcceptedClockIns: React.PropTypes.array.isRequired,
        rotaDate: React.PropTypes.instanceOf(RotaDate).isRequired,
        events: React.PropTypes.array.isRequired
    }
    render(){
        return <HoursChartUi
            clockedIntervals={this.getClockedChartIntervals()}
            proposedAcceptedIntervals={this.getProposedAcceptedIntervals()}
            rotaedIntervals={this.getRotaedChartIntervals()}
            events={this.getEventsList()}
            />
    }
    getEventsList(){
        return this.props.events.map((event) => {
            return {
                timeOffset: this.getHoursSinceStartOfDay(event.time)
            }
        })
    }
    getProposedAcceptedIntervals(){
        return this.getIntervalsFromClockInList(this.props.proposedAcceptedClockIns)
    }
    getDateFromHoursOffset(hoursOffset){
        var date = new Date(this.props.rotaDate.startTime);
        date.setMinutes(date.getMinutes() + hoursOffset * 60);
        return date;
    }
    getRotaedChartIntervals(){
        var self = this;
        return this.props.rotaedShifts.map(function(shift){
            var label = moment(shift.starts_at).format("HH:mm") + " - " +
                moment(shift.ends_at).format("HH:mm");

            return {
                startOffsetInHours: self.getHoursSinceStartOfDay(shift.starts_at),
                endOffsetInHours: self.getHoursSinceStartOfDay(shift.ends_at),
                label,
                type: "rotaed"
            }
        });
    }
    getHoursSinceStartOfDay(date){
        return this.props.rotaDate.getHoursSinceStartOfDay(date);
    }
    getIntervalsFromClockInList(clockInList){
        var clockedIntervals = []
        clockInList.forEach(function(clockIn){
            clockedIntervals = clockedIntervals.concat(convertClockInHoursToIntervals(clockIn))
        })

        var intervals = clockedIntervals.map((interval) => {
            var startTime = interval.starts_at;
            var endTime = interval.ends_at;
            return {
                startOffsetInHours: this.getHoursSinceStartOfDay(startTime),
                endOffsetInHours: this.getHoursSinceStartOfDay(endTime),
                type: interval.type
            }
        });

        return intervals;
    }
    getClockedChartIntervals(){
        return this.getIntervalsFromClockInList(this.props.clockedClockIns)
    }
}
