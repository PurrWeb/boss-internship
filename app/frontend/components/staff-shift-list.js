import React, { Component } from "react"
import moment from "moment"
import _ from "underscore"

class StaffShiftListItem extends Component {
    render(){
        var {shift} = this.props;
        return <div className="staff-shift-list__shift">
            {moment(shift.starts_at).format("H:mm")}
            &nbsp;to&nbsp;
            {moment(shift.ends_at).format("H:mm")}
            &nbsp;
            ({this.props.venueName})
        </div>
    }
}

export default class StaffShiftList extends Component {
    static propTypes = {
        shifts: React.PropTypes.object.isRequired,
        venues: React.PropTypes.object.isRequired,
        rotas: React.PropTypes.object.isRequired
    }
    render() {
        var shifts = _.values(this.props.shifts).map((shift, i) =>{
            var rota = this.props.rotas[shift.rota.clientId];
            var venue = this.props.venues[rota.venue.id];
            return <StaffShiftListItem
                key={i}
                shift={shift}
                venueName={venue.name} />
        })
        return (
            <div className="staff-shift-list">
                {shifts}
            </div>
        );
    }
}
