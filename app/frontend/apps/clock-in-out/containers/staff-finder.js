import React, { Component } from "react"
import { connect } from "react-redux"
import StaffFinder from "~components/staff-finder"
import StaffListItem from "./staff-list-item"
import {selectStaffMembersForClockInOutStaffFinder} from "~redux/selectors"

class ClockInOutStaffFinder extends Component {
    state = {
        justEnteredManagerOrSupervisor: false
    };
    componentWillReceiveProps(nextProps) {
        let justEnteredManagerOrSupervisor = false;

        if (nextProps.userIsManagerOrSupervisor && !this.props.userIsManagerOrSupervisor) {
            justEnteredManagerOrSupervisor = true;
        }

        this.setState({justEnteredManagerOrSupervisor});
    }
    render() {
        var staffTypeClientIds = [this.props.selectedStaffTypeClientId];
        var filterOverrides = {
            staffTypeClientIds,
        };
        var showStaffTypeFilter = false;

        if (this.props.userIsManagerOrSupervisor){
            filterOverrides = {};
            showStaffTypeFilter = true;
        }

        return <StaffFinder
            filters={{
                search: true,
                staffType: showStaffTypeFilter,
                rotaedOrActive: true
            }}
            defaultFilterSettings={{
                rotaedOrActive: true
            }}
            isNewDesign={true}
            justEnteredManagerOrSupervisor = {this.state.justEnteredManagerOrSupervisor}
            staffItemComponent={StaffListItem}
            staffTypes={this.props.staffTypes}
            resetVenue={this.props.resetVenue}
            staff={this.props.staff}
            filterOverrides={filterOverrides} />
    }
}

function mapStateToProps(state){
    return {
        staff: selectStaffMembersForClockInOutStaffFinder(state),
        staffTypes: state.staffTypes
    }
}

export default connect(mapStateToProps)(ClockInOutStaffFinder)
