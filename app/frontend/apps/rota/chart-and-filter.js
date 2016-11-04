import React, { Component } from "react"
import _ from "underscore"
import RotaChart from "~components/rota-chart"
import StaffDetailsAndShifts from "~components/staff-details-and-shifts"
import StaffTypeDropdown from "~components/staff-type-dropdown"
import RotaDate from "~lib/rota-date"
import utils from "~lib/utils"
import ChartSelectionView from "~components/chart-selection-view"
import { selectStaffTypesWithShifts, selectShiftsWithRotaClientIds, selectRotaOnVenueRotaPage } from "~redux/selectors"
import { connect } from "react-redux"

export class ChartAndFilter extends Component {
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
                        Showing {_.values(rotaShifts).length} out of {this.props.rotaShifts.length} shifts.
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
        var staffMember = shift.staff_member.get(this.props.staff);
        var staffType = staffMember.staff_type.get(this.props.staffTypes);
        return staffType.color;
    }
    getStaffTypesWithShifts(){
        return selectStaffTypesWithShifts({
            rotaShifts: this.props.rotaShifts,
            staffTypes: this.props.staffTypes,
            staff: this.props.staff
        });
    }
    getStaffDetailsComponent(staffMemberClientId){
        if (!staffMemberClientId) {
            return null;
        }
        return <StaffDetailsAndShifts
            staffMemberClientId={staffMemberClientId}
            staffTypes={this.props.staffTypes}
            rotaShifts={this.props.rotaShifts}
            rotasById={this.props.rotasById}
            // We specify a key so the component is re-initialized when
            // the shift changes - so we don't keep the previous state.
            key={staffMemberClientId}
            staff={this.props.staff} />
    }
    getRotaShifts(){
        var self = this;
        var staffTypeFilter = self.state.staffTypeFilter;
        var shiftArray = _(this.props.rotaShifts).filter(function(rotaShift){
            var staff = rotaShift.staff_member.get(self.props.staff);
            if (self.state.staffTypeFilter.length > 0){
                 if (!_(staffTypeFilter).contains(staff.staff_type.clientId)) {
                     return false;
                 }
            }

            return true;
        });
        return utils.indexByClientId(shiftArray);
    }
}

function mapStateToProps(state){
    var rota = selectRotaOnVenueRotaPage(state);
    return {
        rotaShifts: selectShiftsWithRotaClientIds(state, [rota.clientId]),
        staffTypes: state.staffTypes,
        staff: state.staffMembers,
        rotasById: state.rotas
    }
}

export default connect(mapStateToProps)(ChartAndFilter);
