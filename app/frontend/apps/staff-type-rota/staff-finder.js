import React from "react"
import { connect } from "react-redux"
import StaffFinder from "~components/staff-finder"

class StaffListItem extends React.Component {
    render(){
        return <div>{JSON.stringify(this.props.staff)}</div>
    }
}

class StaffTypeRotaStaffFinder extends React.Component {
    render(){
        return <div>
            <StaffFinder
                staff={this.props.staff}
                staffTypes={this.props.staffTypes}
                staffItemComponent={StaffListItem}
                />
        </div>
    }
}

function mapStateToProps(state){
    return {
        staff: state.staff,
        staffTypes: state.staffTypes
    }
}

export default connect(mapStateToProps)(StaffTypeRotaStaffFinder)