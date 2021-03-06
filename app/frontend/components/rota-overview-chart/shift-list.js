import PropTypes from 'prop-types';
import React from "react"
import _ from "underscore"
import moment from "moment"

export default class ShiftList extends React.Component {
    static propTypes = {
        shifts: PropTypes.array,
        staff: PropTypes.object
    }
    render (){
        var shiftElements = this.props.shifts.map((shift) => {
            var shiftStaff = shift.staff_member.get(this.props.staff);
            return <div className="row" key={shift.clientId}>
                <div className="shrink column">
                    {moment(shift.starts_at).format("HH:mm")} - {moment(shift.ends_at).format("HH:mm")}
                </div>
                <div className="column">
                    {shiftStaff.first_name} {shiftStaff.surname}
                </div>
            </div>
        });
        return <div>
            {shiftElements}
        </div>
    }
}