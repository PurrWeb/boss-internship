import React from "react"
import StaffDay from "./staff-day"
import { connect } from "react-redux"
import _ from "underscore"

class StaffDayList extends React.Component {
    render(){
        return <div>
            {_.values(this.props.clockInDays).map(clockInDay =>
                <StaffDay />
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
