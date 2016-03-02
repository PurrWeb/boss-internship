import React, { Component } from "react"
import _ from "underscore"
import RotaOverviewChart from "~components/rota-overview-chart"
import renderTooltipHtml from "./render-tooltip-html"
import getStaffTypeBreakdownByTime from "~lib/get-staff-type-breakdown-by-time"
import RotaDate from "~lib/rota-date"

const GRANULARITY = 30;

export default class VenueRotaOverviewChart extends Component {
    static propTypes = {
        staff: React.PropTypes.object.isRequired,
        shifts: React.PropTypes.object.isRequired,
        dateOfRota: React.PropTypes.instanceOf(Date).isRequired,
        staffTypes: React.PropTypes.object.isRequired,
        onHoverShiftsChange: React.PropTypes.func.isRequired,
        onSelectionShiftsChange: React.PropTypes.func.isRequired
    }
    render() {
        return <RotaOverviewChart
                    staff={this.props.staff}
                    shifts={_.values(this.props.shifts)}
                    dateOfRota={this.props.dateOfRota}
                    staffTypes={this.props.staffTypes}
                    onHoverShiftsChange={this.props.onHoverShiftsChange}
                    onSelectionShiftsChange={this.props.onSelectionShiftsChange}
                    getBreakdown={this.getBreakdown.bind(this)}
                    tooltipGenerator={this.generateTooltip.bind(this)}
                    granularity={GRANULARITY}
                    groups={_.values(this.props.staffTypes)} />
    }
    getBreakdown(){
        var { shifts, staff, staffTypes} = this.props;
        var rotaDate = this.getRotaDate();
        return getStaffTypeBreakdownByTime({
            shifts: _.values(shifts),
            staff,
            granularityInMinutes: GRANULARITY,
            staffTypes,
            rotaDate
        });
    }
    generateTooltip(obj, breakdown){
        var selectedStaffTypeTitle = obj.series[0].key;
        var date = breakdown[obj.index].date;
        var breakdownAtPoint = _(breakdown).find((point) => point.date.valueOf() === date.valueOf());

        return renderTooltipHtml({
            shiftsByStaffType: breakdownAtPoint.shiftsByGroup,
            selectedStaffTypeTitle,
            staffTypes: this.props.staffTypes
        });
    }
    getRotaDate(){
        return new RotaDate({dateOfRota: this.props.dateOfRota});
    }
}