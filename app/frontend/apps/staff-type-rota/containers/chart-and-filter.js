import React from "react"
import { connect } from "react-redux"
import ChartAndFilterUi from "../components/chart-and-filter"

class ChartAndFilter extends React.Component {
    render(){
        return <ChartAndFilterUi
            staffMembers={this.props.staffMembers}
            rotaShifts={this.props.rotaShifts}
            updateStaffToPreview={() => {}}
            updateStaffToShow={() => {}}
            staffTypes={this.props.staffTypes} />       
    }
}

function mapStateToProps(state){
    return {
        staffMembers: state.staff,
        rotaShifts: state.rotaShifts,
        staffTypes: state.staffTypes
    }
}

export default connect(mapStateToProps)(ChartAndFilter)