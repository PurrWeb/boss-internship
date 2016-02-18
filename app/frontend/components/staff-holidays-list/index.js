import React from "react"
import { connect } from "react-redux"
import _ from "underscore"
import StaffHolidaysList from "./staff-holidays-list"
import { selectStaffMemberHolidays } from "~redux/selectors"

class StaffHolidaysListContainer extends React.Component {
    static propTypes = {
        staffId: React.PropTypes.number.isRequired
    }
    render(){
        return <StaffHolidaysList holidays={this.props.holidays} />
    }
}

function mapStateToProps(state, ownProps){
    return {
        holidays: selectStaffMemberHolidays(state, ownProps.staffId)
    };
}

export default connect(mapStateToProps)(StaffHolidaysListContainer)