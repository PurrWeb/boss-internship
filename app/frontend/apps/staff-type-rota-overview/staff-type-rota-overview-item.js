import PropTypes from 'prop-types';
import React, { Component } from "react"
import moment from "moment"
import utils from "~/lib/utils"
import { appRoutes } from "~/lib/routes"
import StaffTypeRotaOverviewChart from "./staff-type-rota-overview-chart"
import SelectionDataView from "~/components/rota-overview-chart/selection-data-view"
import ChartSelectionView from "~/components/chart-selection-view"

export default class StaffTypeRotaOverviewItem extends Component {
    static propTypes = {
        dateOfRota: PropTypes.instanceOf(Date).isRequired,
        rotaShifts: PropTypes.array.isRequired,
        staff: PropTypes.object.isRequired,
        staffTypes: PropTypes.object.isRequired,
        staffTypeSlug: PropTypes.string.isRequired,
        venues: PropTypes.object.isRequired,
        rotas: PropTypes.object.isRequired
    }
    constructor(props){
        super(props);
        this.state = {
            hoverData: null,
            selectionData: null
        }
    }
    render() {
        var dateOfRota = this.props.dateOfRota;

        var previewShiftList = this.getShiftList(this.state.hoverData),
            selectionShiftList = this.getShiftList(this.state.selectionData);


        return <div>
            <a href={appRoutes.staffTypeRota({staffTypeSlug: this.props.staffTypeSlug, dateOfRota})}>
                <h2>{moment(dateOfRota).format("ddd D MMMM YYYY")}</h2>
            </a>    
            <div className="boss2-flex-row">
                <div className="column">
                    <StaffTypeRotaOverviewChart
                        staff={this.props.staff}
                        shifts={utils.indexByClientId(this.props.rotaShifts)}
                        staffTypes={this.props.staffTypes}
                        venues={this.props.venues}
                        rotas={this.props.rotas}
                        dateOfRota={dateOfRota}
                        onHoverShiftsChange={(hoverData) => this.setState({hoverData})}
                        onSelectionShiftsChange={(selectionData) => this.setState({selectionData})} />
                </div>
                <div className="shrink column">
                    <ChartSelectionView
                        previewComponent={previewShiftList}
                        selectionComponent={selectionShiftList} />
                </div>
            </div>
        </div>   
    }
    getShiftList(data){
        if (!data){
            return null;
        }
        return <SelectionDataView 
            groupsById={this.props.venues}
            data={data}
            staff={this.props.staff} />
    }
}