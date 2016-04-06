import React, { Component } from "react"
import { connect } from "react-redux"
import StaffFinder from "~components/staff-finder"
import StaffListItem from "./staff-list-item"

class ClockInOutStaffFinder extends Component {
    render() {
        var staffTypeClientIds = [this.props.selectedStaffTypeClientId];
        var filterOverrides = {
            staffTypeClientIds
        };
        var showStaffTypeFilter = false;

        if (this.props.userIsManagerOrSupervisor){
            filterOverrides = {};
            showStaffTypeFilter = true;
        }

        return <StaffFinder
            filters={{
                search: true,
                staffType: showStaffTypeFilter
            }}
            staffItemComponent={StaffListItem}
            staffTypes={this.props.staffTypes}
            staff={this.props.staff}
            filterOverrides={filterOverrides} />

    }
}

function mapStateToProps(state){
    return {
        staff: state.staff,
        staffTypes: state.staffTypes
    }
}

export default connect(mapStateToProps)(ClockInOutStaffFinder)