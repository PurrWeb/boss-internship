import React, { Component } from "react"
import moment from "moment"
import _ from 'underscore'

export default class StaffShiftList extends Component {
    render() {
        var staffId = this.props.staffId;
        var shifts = this.getStaffShifts().map(function(shift, i){
            return <div className="staff-shift-list__shift" key={i}>
                {moment(shift.starts_at).format("dd D MMM YYYY h:mm")}
                &nbsp;to&nbsp;
                {moment(shift.ends_at).format("h:mm")}
            </div>
        })
        return (
            <div className="staff-shift-list">
                {shifts}
            </div>
        );
    }
    getStaffShifts(){
        return _(this.props.rotaShifts).filter({staff_id: this.props.staffId});
    }
}
