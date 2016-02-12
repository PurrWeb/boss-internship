import React from "react"
import { connect } from "react-redux"
import _ from "underscore"
import StaffHolidaysList from "./staff-holidays-list"

class StaffHolidaysListContainer extends React.Component {
    static propTypes = {
        staffId: React.PropTypes.number.isRequired
    }
    render(){
        return <StaffHolidaysList holidays={this.props.holidays} />
    }
}

function mapStateToProps(state, ownProps){
    var staffMember = state.staff[ownProps.staffId];
    var staffMemberHolidayIds = _.pluck(state.staff[ownProps.staffId].holidays, "id");
    var staffMemberHolidays = staffMemberHolidayIds.map(function(id){
        return state.holidays[id];
    });
    return {
        holidays: staffMemberHolidays
    };
}

export default connect(mapStateToProps)(StaffHolidaysListContainer)