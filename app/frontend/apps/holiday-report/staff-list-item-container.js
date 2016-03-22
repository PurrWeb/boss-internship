import React from "react"
import { connect } from "react-redux"
import StaffListItem from "./staff-list-item"
import { selectStaffMemberPaidHolidays, selectStaffMemberUnpaidHolidays } from "~redux/selectors"


class StaffListItemContainer extends React.Component {
    static propTypes = {
        staff: React.PropTypes.object.isRequired
    }
    render(){
        var staff = this.props.staff;
        var staffTypeClientId = staff.staff_type.clientId;
        var staffType = this.props.staffTypes[staffTypeClientId];
        return <StaffListItem
            staff={staff}
            staffType={staffType}
            unpaidHolidays={this.props.unpaidHolidays}
            paidHolidays={this.props.paidHolidays} />
    }
}

function mapStateToProps(state, ownProps){
    var staffId = ownProps.staff.clientId;
    return {
        staffTypes: state.staffTypes,
        paidHolidays: selectStaffMemberPaidHolidays(state, staffId),
        unpaidHolidays: selectStaffMemberUnpaidHolidays(state, staffId),
    }
}

export default connect(mapStateToProps)(StaffListItemContainer)