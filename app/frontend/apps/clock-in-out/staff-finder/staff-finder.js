import React, { Component } from "react"
import { connect } from "react-redux"
import StaffFinder from "~components/staff-finder"
import StaffListItem from "./staff-list-item"

class ClockInOutStaffFinder extends Component {
    render() {
        var staffTypeClientIds = [this.props.selectedStaffType.clientId];

        return <StaffFinder
            filters={{
                search: true,
                staffType: true
            }}
            staffItemComponent={StaffListItem}
            staffTypes={this.props.staffTypes}
            staff={this.props.staff}
            filterOverrides={{
                staffTypeClientIds
            }} />

    }
}

function mapStateToProps(state){
    return {
        staff: state.staff,
        staffTypes: state.staffTypes
    }
}

export default connect(mapStateToProps)(ClockInOutStaffFinder)