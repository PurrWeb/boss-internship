import PropTypes from 'prop-types';
import React from "react"
import { connect } from "react-redux"
import StaffListItem from "./staff-list-item"
import { selectStaffMemberPaidHolidays, selectStaffMemberUnpaidHolidays } from "~/redux/selectors"


class StaffListItemContainer extends React.Component {
    static propTypes = {
        staff: PropTypes.object.isRequired
    }
    render(){
        var props = this.props;
        var staff = this.props.staff;
        var staffTypeClientId = staff.staff_type.clientId;
        var staffType = this.props.staffTypes[staffTypeClientId];
        var venues = staff.venues.map(venue => props.venues[venue.clientId]);
        return <StaffListItem
            staff={staff}
            venues={venues}
            staffType={staffType}
            unpaidHolidays={this.props.unpaidHolidays}
            paidHolidays={this.props.paidHolidays}
            startDate={this.props.startDate}
            endDate={this.props.endDate} />
    }
}

function mapStateToProps(state, ownProps){
    var staffId = ownProps.staff.clientId;
    return {
        startDate: state.pageOptions.weekStartDate,
        endDate: state.pageOptions.weekEndDate,
        staffTypes: state.staffTypes,
        venues: state.venues,
        paidHolidays: selectStaffMemberPaidHolidays(state, staffId),
        unpaidHolidays: selectStaffMemberUnpaidHolidays(state, staffId),
    }
}

export default connect(mapStateToProps)(StaffListItemContainer)
