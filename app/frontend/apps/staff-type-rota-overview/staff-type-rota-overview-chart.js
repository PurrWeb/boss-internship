import React, { Component } from "react"
import _ from "underscore"
import RotaOverviewChart from "~components/rota-overview-chart"
import getGroupedShiftBreakdownByTime from "~lib/get-grouped-shift-breakdown-by-time"
import RotaDate from "~lib/rota-date"

const GRANULARITY = 30;

export default class StaffTypeRotaOverviewChart extends Component {
    static propTypes = {
        staff: React.PropTypes.object.isRequired,
        shifts: React.PropTypes.object.isRequired,
        dateOfRota: React.PropTypes.instanceOf(Date).isRequired,
        staffTypes: React.PropTypes.object.isRequired,
        onHoverShiftsChange: React.PropTypes.func.isRequired,
        onSelectionShiftsChange: React.PropTypes.func.isRequired,
        rotas: React.PropTypes.object.isRequired
    }
    render() {
        return <RotaOverviewChart
                    staff={this.props.staff}
                    shifts={_.values(this.props.shifts)}
                    dateOfRota={this.props.dateOfRota}
                    onHoverShiftsChange={this.props.onHoverShiftsChange}
                    onSelectionShiftsChange={this.props.onSelectionShiftsChange}
                    getBreakdown={this.getBreakdown.bind(this)}
                    tooltipGenerator={this.generateTooltip.bind(this)}
                    granularity={GRANULARITY}
                    groups={_.values(_.mapValues(this.props.venues, function(venue){
                        return Object.assign({}, venue, {
                            color: ["red", "green", "blue"][Math.floor(Math.random() * 3)]
                        })
                    }))} />
    }
    getBreakdown(){
        var { shifts, staff, staffTypes, venues, rotas} = this.props;

        function getStaffTypeFromShift(shift) {
            return staff[shift.staff_member.id].staff_type.id;
        }

        var rotaDate = this.getRotaDate();
        var breakdown = getGroupedShiftBreakdownByTime({
            shifts: _.values(shifts),
            staff,
            granularityInMinutes: GRANULARITY,
            rotaDate,
            groupsById: _.mapValues(venues, function(venue){
                return venue;
            }),
            getGroupFromShift: function(shift){
                var rota = rotas[shift.rota.clientId];
                return venues[rota.venue.id];
            }
        });

        return breakdown;
    }
    generateTooltip(obj, breakdown){
        var selectedStaffTypeTitle = obj.series[0].key;
        var date = breakdown[obj.index].date;
        var breakdownAtPoint = _(breakdown).find((point) => point.date.valueOf() === date.valueOf());

        return "TODO"
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