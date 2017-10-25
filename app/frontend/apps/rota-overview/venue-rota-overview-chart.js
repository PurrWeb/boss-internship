import PropTypes from 'prop-types';
import React, { Component } from "react"
import _ from "underscore"
import RotaOverviewChart from "~/components/rota-overview-chart"
import getGroupedShiftBreakdownByTime from "~/lib/get-grouped-shift-breakdown-by-time"
import RotaDate from "~/lib/rota-date"

const GRANULARITY = 30;

export default class VenueRotaOverviewChart extends Component {
    static propTypes = {
        staff: PropTypes.array.isRequired,
        shifts: PropTypes.array.isRequired,
        dateOfRota: PropTypes.instanceOf(Date).isRequired,
        staffTypes: PropTypes.object.isRequired,
        onHoverShiftsChange: PropTypes.func.isRequired,
        onSelectionShiftsChange: PropTypes.func.isRequired
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
                    granularity={GRANULARITY}
                    groups={_.values(this.props.staffTypes)} />
    }
    getBreakdown(){
        var { shifts, staff, staffTypes} = this.props;

        function getStaffTypeFromShift(shift) {
            return shift.staff_member.get(staff).staff_type.clientId;
        }

        var rotaDate = this.getRotaDate();
        return getGroupedShiftBreakdownByTime({
            shifts: _.values(shifts),
            staff,
            granularityInMinutes: GRANULARITY,
            staffTypes,
            rotaDate,
            groupsById: staffTypes,
            getGroupFromShift: function(shift){
                return shift.staff_member.get(staff).staff_type;    
            }
        });
    }
    getRotaDate(){
        return new RotaDate({dateOfRota: this.props.dateOfRota});
    }
}