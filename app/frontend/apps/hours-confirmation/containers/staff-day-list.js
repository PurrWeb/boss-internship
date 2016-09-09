import React from "react"
import StaffDay from "./staff-day"
import { connect } from "react-redux"
import _ from "underscore"

class StaffDayList extends React.Component {
    render(){
        var clockInDays = this.props.clockInDays;

        if (_.values(clockInDays).length === 0) {
            if (_.values(this.props.hoursAcceptancePeriods).length === 0) {
                return <p>
                    There are no hours to confirm.
                </p>
            }
        }

        return <div>
            {_.values(clockInDays).map(clockInDay =>
                <StaffDay
                    key={clockInDay.clientId}
                    clockInDay={clockInDay} />
            )}
        </div>
    }
}

function mapStateToProps(state){
    return {
        clockInDays: state.clockInDays
    }
}

export default connect(mapStateToProps)(StaffDayList)
