import { connect } from "react-redux"
import React from "react"
import StaffFinder from "~components/staff-finder"

class StaffListItem extends React.Component {
    render(){
        debugger;
        return <div className="staff-list-item">
            <div className="row">
                <div className="col-md-1">
                    <img src={staff.avatar_url} className="staff-list-item__avatar" />
                </div>
                <div className="col-md-4">
                    <h3>
                        {staff.first_name} {staff.surname}
                    </h3>
                    <StaffTypeBadge staffType={staff.staff_type.id} />
                </div>
            </div>
        </div>
    }
}

class HolidayReportStaffFinder extends React.Component {
    render(){
        return <StaffFinder
            staffItemComponent={StaffListItem}
            staff={this.props.staffMembers} />
    }
}

function mapStateToProps(state){
    return {
        staffMembers: state.staffMembers
    }
}

export default connect(mapStateToProps)(HolidayReportStaffFinder)