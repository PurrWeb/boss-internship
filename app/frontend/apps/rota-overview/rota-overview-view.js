import React, { Component } from "react"
import moment from "moment"
import ShiftList from "./shift-list"
import RotaOverviewChart from "./rota-overview-chart"
import ChartSelectionView from "~components/chart-selection-view"

export default class RotaOverviewView extends Component {
    constructor(props){
        super(props);
        this.state = {
            hoverData: null,
            selectionData: null
        }
    }
    render() {
        var previewShiftList = this.getStaffShiftList(this.state.hoverData),
            selectionShiftList = this.getStaffShiftList(this.state.selectionData);

        return <div className="row">
            <div className="col-md-9">
                <RotaOverviewChart
                    staff={this.props.staff}
                    shifts={this.props.rotaShifts}
                    dateOfRota={this.props.dateOfRota}
                    staffTypes={this.props.staffTypes}
                    onHoverShiftsChange={(shifts) => this.setState({hoverData: shifts})}
                    onSelectionShiftsChange={(shifts) => this.setState({selectionData: shifts})} />
            </div>
            <div className="col-md-3">
                <ChartSelectionView
                    previewComponent={previewShiftList}
                    selectionComponent={selectionShiftList} />
            </div>
        </div>
    }
    getStaffShiftList(data){
        if (!data) {
            return null;
        }
        var staffTypeTitle = this.props.staffTypes[data.staffType].title;
        var noStaffRotaedMessage = null;

        if (data.shifts.length === 0) {
            noStaffRotaedMessage = <div>No {staffTypeTitle} staff rotaed.</div>;
        }

        return <div>
            <h2 style={{fontSize: 16}}>
                {staffTypeTitle} staff rotaed for {moment(data.date).format("HH:mm")}
            </h2>
            <ShiftList
                shifts={data.shifts}
                staff={this.props.staff} />
            {noStaffRotaedMessage}
        </div>
    }
}