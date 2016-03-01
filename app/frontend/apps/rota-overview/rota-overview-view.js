import React, { Component } from "react"
import moment from "moment"
import ShiftList from "./shift-list"
import VenueRotaOverviewChart from "./venue-rota-overview-chart"
import ChartSelectionView from "~components/chart-selection-view"
import _ from "underscore"
import RotaForecast from "./containers/rota-forecast"

export default class RotaOverviewView extends Component {
    constructor(props){
        super(props);
        this.state = {
            hoverData: null,
            selectionData: null
        }
    }
    render() {
        var previewShiftList = null, // we don't want a preview here because we want to show the forecast
            selectionShiftList = this.getStaffShiftList(this.state.selectionData);

        return <div className="row">
            <div className="col-md-9">
                <VenueRotaOverviewChart
                    staff={this.props.staff}
                    shifts={this.props.shifts}
                    dateOfRota={this.props.dateOfRota}
                    staffTypes={this.props.staffTypesWithShifts}
                    onHoverShiftsChange={(shifts) => this.setState({hoverData: shifts})}
                    onSelectionShiftsChange={(shifts) => this.setState({selectionData: shifts})} />
            </div>
            <div className="col-md-3">
                {this.getRotaForecast()}
                <ChartSelectionView
                    previewComponent={previewShiftList}
                    selectionComponent={selectionShiftList}
                    selectionIsClearable={true}
                    clearSelection={() => this.setState({selectionData: null})} />
            </div>
        </div>
    }
    getRotaForecast(){
        var display = this.state.selectionData === null ? "block" : "none";
        return <div style={{display: display}}>
            <RotaForecast
                rotaId={this.props.rota.id}
                canEditForecastedTake={true} />
        </div>
    }
    getStaffShiftList(data){
        if (!data) {
            return null;
        }
        var staffTypeTitle = this.props.staffTypesWithShifts[data.staffType].name;
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