import React from "react"
import RotaChart from "~components/rota-chart"
import _ from "underscore"
import ChartSelectionView from "~components/chart-selection-view"
import StaffDetailsAndShifts from "~components/staff-details-and-shifts"

export default class ChartAndFilter extends React.Component {
    static propTypes = {
        staffMembers: React.PropTypes.object.isRequired,
        rotaShifts: React.PropTypes.object.isRequired,
        staffTypes: React.PropTypes.object.isRequired,
        updateStaffToPreview: React.PropTypes.func.isRequired,
        updateStaffToShow: React.PropTypes.func.isRequired,
        staffToPreview: React.PropTypes.number,
        staffToShow: React.PropTypes.number
    }
    static childContextTypes = {
        staffTypes: React.PropTypes.object
    }
    getChildContext(){
        return {
            staffTypes: this.props.staffTypes
        }
    }

    render(){
        var staffDetails = this.getStaffDetailsComponent(this.props.staffToShow);
        var previewStaffDetails = this.getStaffDetailsComponent(this.props.staffToPreview);

        return <div className="row">
            <div className="col-md-9">
                <RotaChart
                    rotaShifts={_.values(this.props.rotaShifts)}
                    staff={this.props.staffMembers}
                    updateStaffToPreview={this.props.updateStaffToPreview}
                    updateStaffToShow={this.props.updateStaffToShow}
                    staffToPreview={this.props.staffToPreview}
                    staffToShow={this.props.staffToShow} />
            </div>
            <div className="col-md-3">
                <ChartSelectionView
                    selectionComponent={staffDetails}
                    previewComponent={previewStaffDetails} />
            </div>
        </div>
    }
    getStaffDetailsComponent(staffId){
        if (!staffId) {
            return null;
        }
        return <StaffDetailsAndShifts
            staffId={staffId}
            staffTypes={this.props.staffTypes}
            rotaShifts={this.props.rotaShifts}
            // We specify a key so the component is re-initialized when
            // the shift changes - so we don't keep the previous state.
            key={staffId}
            staff={this.props.staffMembers} />
    }
}
