import React from "react"
import { connect } from "react-redux"
import StaffTypeBadge from "~components/staff-type-badge"

class StaffListItem extends React.Component {
    render(){
        var staff = this.props.staff;
        var staffTypeId = staff.staff_type.id;
        var staffType = this.props.staffTypes[staffTypeId];
        return <div className="staff-list-item">
            <div className="row">
                <div className="col-md-1">
                    <img src={staff.avatar_url} className="staff-list-item__avatar" />
                </div>
                <div className="col-md-4">
                    <h3>
                        {staff.first_name} {staff.surname}
                    </h3>
                    <StaffTypeBadge staffTypeObject={staffType} />
                </div>
            </div>
        </div>
    }
}

function mapStateToProps(state){
    return {
        staffTypes: state.staffTypes
    }
}

export default connect(mapStateToProps)(StaffListItem)