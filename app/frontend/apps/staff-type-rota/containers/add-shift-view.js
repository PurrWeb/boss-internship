import React from "react"
import { connect } from "react-redux"
import StaffTypeRotaStaffFinder from "../components/staff-type-rota-staff-finder"


class AddShiftView extends React.Component {
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
            <StaffTypeRotaStaffFinder
                staff={this.props.staff}
                venues={this.props.venues}
                staffTypes={this.props.staffTypes} />
        </div>
    }
}

function mapStateToProps(state){
    return {
        staff: state.staff,
        staffTypes: state.staffTypes,
        venues: state.venues
    }
}

export default connect(mapStateToProps)(AddShiftView)