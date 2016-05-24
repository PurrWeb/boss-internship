import React from "react"
import RotaDate from "~lib/rota-date"
import _ from "underscore"
import moment from "moment"
import convertClockInPeriodToIntervals from "./convert-clock-in-period-to-intervals"
import HoursChartUi from "./hours-chart-content"

export default class HoursChart extends React.Component {
    static propTypes = {
        clockedClockInPeriods: React.PropTypes.array.isRequired,
        rotaedShifts: React.PropTypes.array.isRequired,
        hoursAcceptancePeriods: React.PropTypes.array.isRequired,
        rotaDate: React.PropTypes.instanceOf(RotaDate).isRequired,
        clockInDayEvents: React.PropTypes.array.isRequired
    }
    constructor(props){
        super(props)
        this.state = {
            interactionState: {
                hoveredInterval: null
            }
        }
    }
    render(){
        return <HoursChartUi
            clockedIntervals={this.getClockedChartIntervals()}
            hoursAcceptanceIntervals={this.getHoursAcceptanceIntervals()}
            rotaedIntervals={this.getRotaedChartIntervals()}
            events={this.getEventsList()}
            interactionState={this.state.interactionState}
            onHoveredIntervalChange={(hoveredInterval) =>
                this.setInteractionState({hoveredInterval})
            }
            />
    }
    getEventsList(){
        return this.props.clockInEvents.map((event) => {
            return {
                timeOffset: this.getHoursSinceStartOfDay(event.time),
                type: event.type
            }
        })
    }
    setInteractionState(interactionState){
        this.setState({
            interactionState: Object.assign({}, this.state.interactionState, interactionState)
        })
    }
    getHoursAcceptanceIntervals(){
        return this.getIntervalsFromClockInPeriodList(this.props.hoursAcceptancePeriods)
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
    getIntervalsFromClockInPeriodList(clockInList){
        var clockedIntervals = []
        clockInList.forEach((clockIn) => {
            clockedIntervals = clockedIntervals.concat(convertClockInPeriodToIntervals(clockIn, this.props.clockInBreaks))
        })

        var intervals = clockedIntervals.map((interval) => {
            var startTime = interval.starts_at;
            var endTime = interval.ends_at;
            var tooltipLabel = moment(startTime).format("HH:mm") + " - " + moment(endTime).format("HH:mm");
            return {
                startOffsetInHours: this.getHoursSinceStartOfDay(startTime),
                endOffsetInHours: this.getHoursSinceStartOfDay(endTime),
                type: interval.type,
                tooltipLabel
            }
        });

        return intervals;
    }
    getClockedChartIntervals(){
        return this.getIntervalsFromClockInPeriodList(this.props.clockedClockInPeriods)
    }
}
