import React, { Component } from "react"
import VenueRotaOverviewChart from "./venue-rota-overview-chart"
import ChartSelectionView from "~components/chart-selection-view"
import _ from "underscore"
import RotaForecast from "./containers/rota-forecast"
import SelectionDataView from "~components/rota-overview-chart/selection-data-view"

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
            selectionShiftList = this.getSelectionDataView(this.state.selectionData);

        return <div className="row">
            <div className="column">
                <VenueRotaOverviewChart
                    staff={this.props.staff}
                    shifts={this.props.shifts}
                    dateOfRota={this.props.dateOfRota}
                    staffTypes={this.props.staffTypesWithShifts}
                    onHoverShiftsChange={(data) => this.setState({hoverData: data})}
                    onSelectionShiftsChange={(data) => this.setState({selectionData: data})} />
            </div>
            <div className="shrink column">
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
                rotaClientId={this.props.rota.clientId}
                canEditForecastedTake={true} />
        </div>
    }
    getSelectionDataView(data){
        if (!data){
            return data;
        }
        return <SelectionDataView
                groupsById={this.props.staffTypesWithShifts}
                data={data}
                staff={this.props.staff} />
    }
}
