import { connect } from "react-redux"
import React from "react"
import StaffFinder from "~/components/staff-finder"
import StaffListItemContainer from "./staff-list-item-container"

class HolidayReportStaffFinder extends React.Component {
    render(){
        return <StaffFinder
            filters={{
                search: true,
                staffType: true
            }}
            staffItemComponent={StaffListItemContainer}
            staffTypes={this.props.staffTypes}
            staff={this.props.staff} />
    }
}

function mapStateToProps(state){
    return {
        staff: state.staffMembers,
        staffTypes: state.staffTypes
    }
}

export default connect(mapStateToProps)(HolidayReportStaffFinder)
