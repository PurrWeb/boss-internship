import React, { Component } from "react"
import _ from "underscore"
import RotaChart from "~components/rota-chart"
import StaffDetailsAndShifts from "~components/staff-details-and-shifts"
import StaffTypeDropdown from "~components/staff-type-dropdown"
import RotaDate from "~lib/rota-date"
import utils from "~lib/utils"
import ChartSelectionView from "~components/chart-selection-view"
import { selectStaffTypesWithShifts } from "~redux/selectors"

export default class ChartAndFilter extends Component {
    constructor(props){
        super(props);
        this.state = {
            staffTypeFilter: [],
            staffToShow: null,
            staffToPreview: null
        };
    }
    render(){
        var staffDetails = this.getStaffDetailsComponent(this.state.staffToShow);
        var previewStaffDetails = this.getStaffDetailsComponent(this.state.staffToPreview);
        
        var rotaShifts = this.getRotaShifts();

        return (
            <div className="row">
                <div className="col-md-9">
                    <RotaChart
                        rotaShifts={rotaShifts}
                        staff={this.props.staff}
                        updateStaffToPreview={(staffId) => this.setState({staffToPreview: staffId})}
                        updateStaffToShow={(staffId) => this.setState({staffToShow: staffId})}
                        staffToPreview={this.state.staffToPreview}
                        staffToShow={this.state.staffToShow}
                        staffTypes={this.props.staffTypes}
                        getShiftColor={(shift) => this.getShiftColor(shift)}
                        />
                </div>
                <div className="col-md-3">
                    Filter chart
                    <StaffTypeDropdown
                        selectedStaffTypes={this.state.staffTypeFilter}
                        staffTypes={this.getStaffTypesWithShifts()}
                        onChange={
                            (value) => this.setState({"staffTypeFilter": value})
                        } />

                    <div styles={{marginTop: 4}}>
                        Showing {rotaShifts.length} out of {this.props.rotaShifts.length} shifts.
                    </div>

                    <div className="chart-and-filter__shift-editor-container">
                        <ChartSelectionView
                            selectionComponent={staffDetails}
                            previewComponent={previewStaffDetails} />
                    </div>
                </div>
            </div>
        )
    }
    getShiftColor(shift){
        var staffMember = this.props.staff[shift.staff_member.id];
        return this.props.staffTypes[staffMember.staff_type.id].color;

         this.props.staffTypes[shift.staff.staff_type.id].color
    }
    getStaffTypesWithShifts(){
        return selectStaffTypesWithShifts({
            rotaShifts: this.props.rotaShifts,
            staffTypes: this.props.staffTypes,
            staff: this.props.staff
        });
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
            staff={this.props.staff} />
    }
    getRotaShifts(){
        var self = this;
        var staffTypeFilter = self.state.staffTypeFilter;
        return _(this.props.rotaShifts).filter(function(rotaShift){
            var staff = self.props.staff[rotaShift.staff_member.id];
            if (self.state.staffTypeFilter.length > 0){
                 if (!_(staffTypeFilter).contains(staff.staff_type.id)) {
                     return false;
                 }
            }

            return true;
        })
    }
}
