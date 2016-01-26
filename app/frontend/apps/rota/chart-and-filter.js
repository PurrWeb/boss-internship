import React, { Component } from "react"
import _ from "underscore"
import RotaChart from "./rota-chart/rota-chart"
import StaffDetailsAndShifts from "./rota-chart/staff-details-and-shifts"
import StaffTypeDropdown from "~components/staff-type-dropdown"
import RotaDate from "~lib/rota-date"
import utils from "~lib/utils"
import ChartSelectionView from "~components/chart-selection-view"

const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;

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
        var chartBoundaries = ChartAndFilter.calculateChartBoundaries(rotaShifts);

        return (
            <div className="row">
                <div className="col-md-9">
                    <RotaChart
                        rotaShifts={rotaShifts}
                        startTime={chartBoundaries.start}
                        endTime={chartBoundaries.end}
                        staff={this.props.staff}
                        updateStaffToPreview={(staffId) => this.setState({staffToPreview: staffId})}
                        updateStaffToShow={(staffId) => this.setState({staffToShow: staffId})}
                        staffToPreview={this.state.staffToPreview}
                        staffToShow={this.state.staffToShow}
                        />
                </div>
                <div className="col-md-3">
                    Filter chart
                    <StaffTypeDropdown
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
    getStaffDetailsComponent(staffId){
        if (!staffId) {
            return null;
        }
        return <StaffDetailsAndShifts
            staffId={staffId}
            rotaShifts={this.props.rotaShifts}
            // We specify a key so the component is re-initialized when
            // the shift changes - so we don't keep the previous state.
            key={this.state.staffToShow}
            staff={this.props.staff} />
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

        var rotaDate;
        if (_.isEmpty(rotaShifts)) {
            startOffset = 0;
            endOffset = 24;
            rotaDate = new RotaDate(new Date());
        } else {
            rotaDate = new RotaDate(rotaShifts[0].starts_at);

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
        }

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
