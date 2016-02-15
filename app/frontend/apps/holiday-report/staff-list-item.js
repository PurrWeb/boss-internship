import React from "react"
import StaffTypeBadge from "~components/staff-type-badge"

export default class StaffListItem extends React.Component {
    static propTypes = {
        staff: React.PropTypes.object.isRequired,
        staffType: React.PropTypes.object.isRequired
    }
    render(){
        var staff = this.props.staff;
        var staffType = this.props.staffType;
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
                <div className="col-md-4">
                    <h4>Paid holiday</h4>
                </div>
                <div className="col-md-4">
                    <h4>Paid holiday</h4>
                </div>
                <div className="col-md-4">
                    <h4>Paid holiday</h4>
                </div>
            </div>
        </div>
    }
}