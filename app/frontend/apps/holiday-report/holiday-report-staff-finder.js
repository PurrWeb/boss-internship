import { connect } from "react-redux"
import React from "react"

export default class HolidayReportStaffFinder extends React.Component {
    render(){
        return <StaffFinder />
    }
}

function mapStateToProps(state){
    return state;
}

export default connect(mapStateToProps)(HolidayReportStaffFinder)