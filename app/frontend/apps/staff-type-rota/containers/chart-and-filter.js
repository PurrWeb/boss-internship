import React from "react"
import { connect } from "react-redux"
import ChartAndFilterUi from "../components/chart-and-filter"

class ChartAndFilter extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            staffMemberIdToShow: null,
            staffMemberIdToPreview: null
        }
    }
    render(){
        return <ChartAndFilterUi
            staffMembers={this.props.staffMembers}
            rotaShifts={this.props.rotaShifts}
            updateStaffToPreview={(staffMemberId) => this.setState({staffMemberIdToPreview: staffMemberId})}
            updateStaffToShow={(staffMemberId) => this.setState({staffMemberIdToShow: staffMemberId})}
            staffToShow={this.state.staffMemberIdToShow}
            staffToPreview={this.state.staffMemberIdToPreview}
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