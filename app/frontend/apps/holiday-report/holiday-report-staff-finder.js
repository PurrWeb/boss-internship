import { connect } from "react-redux"
import React from "react"
import StaffFinder from "~components/staff-finder"

class StaffListItem extends React.Component {
    render(){
        return <div>
            {JSON.stringify(this.props)}
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