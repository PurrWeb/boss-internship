import { connect } from "react-redux"
import React from "react"
import StaffFinder from "~components/staff-finder"
import StaffListItemContainer from "./staff-list-item-container"

class HolidayReportStaffFinder extends React.Component {
    render(){
        return <StaffFinder
            staffItemComponent={StaffListItemContainer}
            staff={this.props.staffMembers} />
    }
}

function mapStateToProps(state){
    return {
        staffMembers: state.staffMembers
    }
}

export default connect(mapStateToProps)(HolidayReportStaffFinder)