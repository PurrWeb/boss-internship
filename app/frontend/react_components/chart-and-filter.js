import React, { Component } from "react"
import _ from "underscore"
import RotaChart from "./rota-chart/rota-chart.js"
import StaffShiftEditor from "./rota-chart/staff-shift-editor.js"
import StaffTypeDropdown from "./staff-type-dropdown.js"

export default class ChartAndFilter extends Component {
    constructor(props){
        super(props);
        this.state = {
            staffTypeFilter: [],
            shiftToShow: null,
            shiftToPreview: null
        };
    }
    componentWillReceiveProps(nextProps){
        if (this.state.shiftToShow === null) {
            return;
        }
        var shiftToShowWasDeleted = !_(nextProps.rotaShifts).find({id: this.state.shiftToShow.id});
        if (shiftToShowWasDeleted){
            this.setState({shiftToShow: null})
        }
    }
    render(){
        var shiftEditor, previewShiftEditor;
        if (this.state.shiftToShow) {
            shiftEditor = <StaffShiftEditor
                shift={this.state.shiftToShow}
                rotaShifts={this.props.rotaShifts}
                staff={this.props.staff} />
        }
        if (this.state.shiftToPreview) {
            previewShiftEditor = <StaffShiftEditor
                shift={this.state.shiftToPreview}
                rotaShifts={this.props.rotaShifts}
                staff={this.props.staff} />
        }

        return (
            <div className="row">
                <div className="col-md-9">
                    <RotaChart
                        rotaShifts={this.getRotaShifts()}
                        staffTypes={this.props.staffTypes}
                        staff={this.props.staff}
                        updateShiftToPreview={(shift) => this.setState({shiftToPreview: shift})}
                        updateShiftToShow={(shift) => this.setState({shiftToShow: shift})} />
                </div>
                <div className="col-md-3">
                    Filter chart
                    <StaffTypeDropdown
                        staffTypes={this.props.staffTypes}
                        onChange={
                            (value) => this.setState({"staffTypeFilter": value})
                        } />
                    <div
                        className="chart-and-filter__shift-editor-container" >
                        <div
                            className="chart-and-filter__selected-shift-editor"
                            style={{opacity: this.state.shiftToPreview !== null ? "0": "1"}}>
                            {shiftEditor}
                        </div>
                        <div className="chart-and-filter__preview-shift-editor">
                            {previewShiftEditor}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    getRotaShifts(){
        var self = this;
        return _(this.props.rotaShifts).filter(function(rotaShift){
            var staff = self.props.staff[rotaShift.staff_id];
            if (self.state.staffTypeFilter.length > 0){
                 if (!_(self.state.staffTypeFilter).contains(staff.staff_type)) {
                     return false;
                 }
            }

            return true;
        })
    }
}
