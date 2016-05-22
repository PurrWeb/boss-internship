import React from "react"
import StaffDayUi from "../components/staff-day"
import { connect } from "react-redux"
import RotaDate from "~lib/rota-date"

class StaffDay extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            amendedClockIns: [],
            markedAsDone: false
        }
    }
    render(){
        var props = this.props;
        return <div>just do store logic for now</div>
        return <StaffDayUi
            markedAsDone={this.state.markedAsDone}
            rotaDate={new RotaDate({
                dateOfRota: props.clockInDay.date
            })}
            clockedClockIns={props.clockedClockIns}
            rotaedShifts={props.rotaedShifts}
            acceptedHours={this.state.proposedInfo}
            onAcceptedHoursChanged={(acceptedHours) =>{
                this.setState({proposedInfo: acceptedHours})
            }}
            markDayAsDone={() => this.setState({markedAsDone: true})}
            events={props.events}
            staffMember={this.props.staffMember}
            predefinedReasons={props.predefinedReasons}
            notes={props.notes}
            staffType={this.props.staffType}
        />
    }
}

function mapStateToProps(state, ownProps){
    var staffMember = ownProps.clockInDay.staff_member.get(state.staff);
    var props = {
        staffMember,
        staffType: staffMember.staff_type.get(state.staffTypes)
    }
    return props;
}

export default connect(mapStateToProps)(StaffDay)
