import React from "react"
import StaffDayUi from "../components/staff-day"
import { connect } from "react-redux"
import RotaDate from "~lib/rota-date"
import { selectClockInDayDetails } from "~redux/selectors"

class StaffDay extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            amendedClockInPeriods: props.amendedClockInPeriods,
            markedAsDone: false
        }
    }
    render(){
        var props = this.props;
        return <StaffDayUi
            markedAsDone={this.state.markedAsDone}
            rotaDate={new RotaDate({
                dateOfRota: props.clockInDay.date
            })}
            clockedClockInPeriods={props.clockedClockInPeriods}
            rotaedShifts={props.rotaedShifts}
            amendedClockInPeriods={this.state.amendedClockInPeriods}

            // onAcceptedHoursChanged={(acceptedHours) =>{
            //     this.setState({proposedInfo: acceptedHours})
            // }}
            markDayAsDone={() => this.setState({markedAsDone: true})}
            clockInEvents={props.clockInEvents}
            staffMember={this.props.staffMember}
            clockInReasons={props.clockInReasons}
            clockInNotes={props.clockInNotes}
            staffType={this.props.staffType}
            clockInBreaks={this.props.clockInBreaks}
        />
    }
}

function mapStateToProps(state, ownProps){
    var details = selectClockInDayDetails(state, ownProps.clockInDay)
    var staffMember = details.staffMember;
    var props = {
        ...details,
        clockInReasons: state.clockInReasons,
        staffType: staffMember.staff_type.get(state.staffTypes),
        clockInReasons: state.clockInReasons
    }
    return props;
}

export default connect(mapStateToProps)(StaffDay)
