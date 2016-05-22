import React from "react"
import StaffDayUi from "../components/staff-day"
import { connect } from "react-redux"
import RotaDate from "~lib/rota-date"
import { selectClockInDayDetails } from "~redux/selectors"

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
        return <StaffDayUi
            markedAsDone={this.state.markedAsDone}
            rotaDate={new RotaDate({
                dateOfRota: props.clockInDay.date
            })}
            clockedClockInPeriods={props.clockedClockInPeriods}
            // rotaedShifts={props.rotaedShifts}
            // acceptedHours={this.state.proposedInfo}
            // onAcceptedHoursChanged={(acceptedHours) =>{
            //     this.setState({proposedInfo: acceptedHours})
            // }}
            markDayAsDone={() => this.setState({markedAsDone: true})}
            // events={props.events}
            staffMember={this.props.staffMember}
            clockInReasons={props.clockInReasons}
            notes={props.notes}
            staffType={this.props.staffType}
            clockInBreaks={this.props.clockInBreaks}
        />
    }
}

function mapStateToProps(state, ownProps){
    var {
        staffMember,
        clockedClockInPeriods,
        amendedClockInPeriods,
        clockInBreaks
    } =  selectClockInDayDetails(state, ownProps.clockInDay)
    var props = {
        staffMember,
        clockedClockInPeriods,
        amendedClockInPeriods,
        clockInBreaks,
        clockInReasons: state.clockInReasons,
        staffType: staffMember.staff_type.get(state.staffTypes)
    }
    return props;
}

export default connect(mapStateToProps)(StaffDay)
