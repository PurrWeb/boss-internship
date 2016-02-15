import { connect } from "react-redux"
import React from "react"
import StaffFinder from "~components/staff-finder"
import StaffListItem from "./staff-list-item"

class HolidayReportStaffFinder extends React.Component {
    render(){
        return <StaffFinder
            staffItemComponent={StaffListItem}
            staff={this.props.staffMembers} />
    }
}

function mapStateToProps(state){
    return {
        staffMembers: state.staffMembers
    }
}

export default connect(mapStateToProps)(HolidayReportStaffFinder)