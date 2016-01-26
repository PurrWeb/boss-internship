import React, { Component } from "react"
import ShiftList from "./shift-list"
import RotaOverviewChart from "./rota-overview-chart"
import ChartSelectionView from "~components/chart-selection-view"

export default class RotaOverviewView extends Component {
    constructor(props){
        super(props);
        this.state = {
            hoverShifts: [],
            selectionShifts: []
        }
    }
    getStaffShiftList(shifts){
        if (shifts.length === 0) {
            return null;
        }
        return <ShiftList
            shifts={shifts}
            staff={this.props.staff} />
    }
    render() {
        var previewShiftList = this.getStaffShiftList(this.state.hoverShifts),
            selectionShiftList = this.getStaffShiftList(this.state.selectionShifts);

        return <div className="row">
            <div className="col-md-9">
                <RotaOverviewChart
                    staff={this.props.staff}
                    shifts={this.props.rotaShifts}
                    dateOfRota={this.props.dateOfRota}
                    staffTypes={this.props.staffTypes}
                    onHoverShiftsChange={(shifts) => this.setState({hoverShifts: shifts})}
                    onSelectionShiftsChange={(shifts) => this.setState({selectionShifts: shifts})} />
            </div>
            <div className="col-md-3">
                <ChartSelectionView
                    previewComponent={previewShiftList}
                    selectionComponent={selectionShiftList} />
            </div>
        </div>
    }
}