import React from "react"
import StaffDayUi from "../components/staff-day"
import { connect } from "react-redux"
import RotaDate from "~/lib/rota-date"
import { selectClockInDayDetails } from "~/redux/selectors"
import actionCreators from "~/redux/actions"
import { bindActionCreators } from "redux"

class StaffDay extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            markedAsDone: false
        }
    }
    render(){
        return <StaffDayUi
            markedAsDone={this.state.markedAsDone}
            markDayAsDone={() => this.setState({markedAsDone: true})}
            boundActions={this.props.boundActions}
            {...this.props}
        />
    }
}

function mapStateToProps(state, ownProps){
    var details = selectClockInDayDetails(state, ownProps.clockInDay)
    var staffMember = details.staffMember;
    var clockInDay = details.clockInDay;
    var readonly = ownProps.readonly;
    var props = {
        ...details,
        clockInReasons: state.clockInReasons,
        venue: clockInDay.venue.get(readonly ? state.readonlyVenues : state.venues),
        staffType: staffMember.staff_type.get(state.staffTypes),
        rotaDate: new RotaDate({
            dateOfRota: ownProps.clockInDay.date
        }),
        componentErrors: state.componentErrors
    }
    return props;
}

function mapDispatchToProps(dispatch){
    return {
        boundActions: bindActionCreators(actionCreators(), dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StaffDay)
