import React from "react"
import { connect } from "react-redux"
import StaffFinder from "~components/staff-finder"
import StaffListItem from "~components/rota-staff-list-item"


class StaffTypeRotaStaffFinder extends React.Component {
    static childContextTypes = {
        canAddShift: React.PropTypes.func.isRequired,
        addShift: React.PropTypes.func.isRequired
    }
    getChildContext(){
        return {
            canAddShift: function(){
                return true;
            },
            addShift: function(){
                alert("not implemented")
            }
        }
    }
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