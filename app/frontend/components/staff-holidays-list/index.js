import React from "react"
import { connect } from "react-redux"
import _ from "underscore"
import StaffHolidaysList from "./staff-holidays-list"
import { selectStaffMemberHolidays } from "~redux/selectors"

class StaffHolidaysListContainer extends React.Component {
    static propTypes = {
        staffMemberClientId: React.PropTypes.string.isRequired
    }
    render(){
        return <StaffHolidaysList holidays={this.props.holidays} />
    }
}

function mapStateToProps(state, ownProps){
    return {
        holidays: selectStaffMemberHolidays(state, ownProps.staffMemberClientId)
    };
}

export default connect(mapStateToProps)(StaffHolidaysListContainer)