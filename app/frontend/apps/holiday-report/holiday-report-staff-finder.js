import { connect } from "react-redux"
import React from "react"
import StaffFinder from "~components/staff-finder"
import StaffListItemContainer from "./staff-list-item-container"

class HolidayReportStaffFinder extends React.Component {
    render(){
        return <StaffFinder
            staffItemComponent={StaffListItemContainer}
            staff={this.props.staff} />
    }
}

function mapStateToProps(state){
    return {
        staff: state.staff
    }
}

export default connect(mapStateToProps)(HolidayReportStaffFinder)