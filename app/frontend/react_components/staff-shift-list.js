import React, { Component } from "react"
import moment from "moment"
import _ from 'underscore'

export default class StaffShiftList extends Component {
    static contextTypes = {
        rotaShifts: React.PropTypes.array
    }
    render() {
        var staffId = this.props.staffId;
        var shifts = this.getStaffShifts().map(function(shift, i){
            return <div className="staff-shift-list__shift" key={i}>
                {moment(shift.starts_at).format("dd D MMM YYYY H:mm")}
                &nbsp;to&nbsp;
                {moment(shift.ends_at).format("H:mm")}
            </div>
        })
        return (
            <div className="staff-shift-list">
                {shifts}
            </div>
        );
    }
    getStaffShifts(){
        return _(this.context.rotaShifts).filter({staff_id: this.props.staffId});
    }
}
