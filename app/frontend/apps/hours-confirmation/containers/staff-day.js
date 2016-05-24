import React from "react"
import StaffDayUi from "../components/staff-day"
import { connect } from "react-redux"
import RotaDate from "~lib/rota-date"
import { selectClockInDayDetails } from "~redux/selectors"

class StaffDay extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            hoursAcceptancePeriods: props.hoursAcceptancePeriods,
            markedAsDone: false
        }
    }
    render(){
        var stateHoursAcceptancePeriods = this.state.hoursAcceptancePeriods;
        var uiProps = {...this.props}
        uiProps.hoursAcceptancePeriods = stateHoursAcceptancePeriods;
        return <StaffDayUi
            markedAsDone={this.state.markedAsDone}
            // onAcceptedHoursChanged={(acceptedHours) =>{
            //     this.setState({proposedInfo: acceptedHours})
            // }}
            markDayAsDone={() => this.setState({markedAsDone: true})}
            {...uiProps}
        />
    }
}

function mapStateToProps(state, ownProps){
    var details = selectClockInDayDetails(state, ownProps.clockInDay)
    var staffMember = details.staffMember;
    var clockInStatus = state.clockInStatuses[staffMember.clientId].status
    var props = {
        ...details,
        staffMemberClockInStatus: clockInStatus,
        clockInReasons: state.clockInReasons,
        staffType: staffMember.staff_type.get(state.staffTypes),
        clockInReasons: state.clockInReasons,
        rotaDate: new RotaDate({
            dateOfRota: ownProps.clockInDay.date
        })
    }
    return props;
}

export default connect(mapStateToProps)(StaffDay)
