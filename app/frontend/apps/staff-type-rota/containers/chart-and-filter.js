import React from "react"
import { connect } from "react-redux"
import ChartAndFilterUi from "../components/chart-and-filter"
import { selectVenuesWithShifts }  from "~redux/selectors"

class ChartAndFilter extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            staffMemberIdToShow: null,
            staffMemberIdToPreview: null,
            selectedVenueIds: []
        }
    }
    render(){
        return <ChartAndFilterUi
            staffMembers={this.props.staffMembers}
            rotaShifts={this.props.rotaShifts}
            rotas={this.props.rotas}
            updateStaffToPreview={(staffMemberId) => this.setState({staffMemberIdToPreview: staffMemberId})}
            updateStaffToShow={(staffMemberId) => this.setState({staffMemberIdToShow: staffMemberId})}
            staffToShow={this.state.staffMemberIdToShow}
            staffToPreview={this.state.staffMemberIdToPreview}
            staffTypes={this.props.staffTypes}
            venues={this.props.venues}
            selectedVenueIds={this.state.selectedVenueIds}
            onVenueFilterChange={(selectedVenueIds) => this.setState({selectedVenueIds})} />
    }
}

function mapStateToProps(state){
    return {
        staffMembers: state.staff,
        rotaShifts: state.rotaShifts,
        staffTypes: state.staffTypes,
        venues: selectVenuesWithShifts(state),
        rotas: state.rotas
    }
}

export default connect(mapStateToProps)(ChartAndFilter)