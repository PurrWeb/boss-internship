import React from "react"
import { connect } from "react-redux"
import StaffListItem from "./staff-list-item"


class StaffListItemContainer extends React.Component {
    render(){
        var staff = this.props.staff;
        var staffTypeId = staff.staff_type.id;
        var staffType = this.props.staffTypes[staffTypeId];
        return <StaffListItem
            staff={staff}
            staffType={staffType} />
    }
}

function mapStateToProps(state){
    return {
        staffTypes: state.staffTypes
    }
}

export default connect(mapStateToProps)(StaffListItemContainer)