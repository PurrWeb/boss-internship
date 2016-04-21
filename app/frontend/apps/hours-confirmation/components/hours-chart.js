import React from "react"
import d3 from "d3"
import RotaDate from "~lib/rota-date"

class HoursChartUi extends React.Component {
    render(){
        return <div>
            <svg ref={(el) => this.el = el} />
        </div>
    }
    componentDidMount(){
        this.renderChart();
    }
    renderChart() {
        var chart = d3.select(this.el);

        debugger;

    }
}

export default class HoursChart extends React.Component {
    static propTypes = {
        clockedEvents: React.PropTypes.array.isRequired,
        clockedIntervals: React.PropTypes.array.isRequired
    }
    render(){
        return <HoursChartUi
            clockedIntervals={this.getChartIntervals()} />
    }
    getChartIntervals(){
        var {clockedIntervals, clockedEvents} = this.props;

        return clockedIntervals.map((interval) => {
            var startTime = interval.startEvent.get(clockedEvents).time;
            var endTime = interval.endEvent.get(clockedEvents).time;
            return {
                startOffsetInHours: getStartOffsetInHours(startTime),
                endOffsetInHours: getEndOffsetInHours(endTime)
            }
        });

        function getStartOffsetInHours(date){
            var rotaDate = new RotaDate({shiftStartsAt: date})
            return getOffsetInHours(rotaDate, date);
        }
        function getEndOffsetInHours(date){
            var rotaDate = new RotaDate({shiftEndsAt: date})
            return getOffsetInHours(rotaDate, date);
        }
        function getOffsetInHours(rotaDate, date){
            return rotaDate.getHoursSinceStartOfDay(date);
        }
    }
}