import React, { Component } from "react"
import _ from "underscore"
import RotaChart from "./rota-chart/rota-chart.js"
import StaffShiftEditor from "./rota-chart/staff-shift-editor.js"
import StaffTypeDropdown from "./staff-type-dropdown.js"
import RotaDate from "../lib/rota-date"
import utils from "../lib/utils"

const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;

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

        var rotaShifts = this.getRotaShifts();
        var chartBoundaries = ChartAndFilter.calculateChartBoundaries(rotaShifts);

        return (
            <div className="row">
                <div className="col-md-9">
                    <RotaChart
                        rotaShifts={rotaShifts}
                        startTime={chartBoundaries.start}
                        endTime={chartBoundaries.end}
                        staff={this.props.staff}
                        updateShiftToPreview={(shift) => this.setState({shiftToPreview: shift})}
                        updateShiftToShow={(shift) => this.setState({shiftToShow: shift})} />
                </div>
                <div className="col-md-3">
                    Filter chart
                    <StaffTypeDropdown
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
    /**
     * Many venues ony operate at certain times, so we detect the times where there are
     * shifts and only show those.
     * @return {object} Object with "start" and "end" values that can be passed into the rota chart.
     */
    static calculateChartBoundaries = function(rotaShifts){
        // Values indicating how many hours we're into the day
        var startOffset = 23; // means 7am based on an 8am start
        var endOffset = 1; // means 9am based on an 8am start
        var rotaDate = new RotaDate(rotaShifts[0].starts_at)

        // Adjust offset range everytime we find a shift that's not contained inside it
        rotaShifts.forEach(function(rotaShift){
            var shiftStartOffset = rotaDate.getHoursSinceStartOfDay(rotaShift.starts_at);
            var shiftEndOffset = rotaDate.getHoursSinceStartOfDay(rotaShift.ends_at);
            if (shiftStartOffset < startOffset) {
                startOffset = Math.floor(shiftStartOffset);
            }
            if (shiftEndOffset > endOffset) {
                endOffset =  Math.ceil(shiftEndOffset)
            }
        });

        startOffset -= 1;
        startOffset = utils.containNumberWithinRange(startOffset, [0, 24]);
        endOffset += 1;
        endOffset = utils.containNumberWithinRange(endOffset, [0, 24]);

        var boundaries = {
            start: new Date(rotaDate.startTime.valueOf() + startOffset * MILLISECONDS_PER_HOUR).getHours(),
            end: new Date(rotaDate.endTime.valueOf() + endOffset * MILLISECONDS_PER_HOUR).getHours(),
        };
        return boundaries;
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
