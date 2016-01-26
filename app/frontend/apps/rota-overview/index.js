import React, { Component } from "react"
import ShiftList from "./shift-list"
import RotaOverviewChart from "./rota-overview-chart"

export default class RotaOverviewView extends Component {
    constructor(props){
        super(props);
        this.state = {
            hoverShifts: []
        }
    }
    render() {
        console.log("hoverShifts", this.state.hoverShifts)
        return <div className="row">
            <div className="col-md-9">
                <RotaOverviewChart
                    staff={this.props.staff}
                    shifts={this.props.rotaShifts}
                    dateOfRota={this.props.dateOfRota}
                    staffTypes={this.props.staffTypes}
                    onHoverShiftsChange={(shifts) => this.setState({hoverShifts: shifts})} />
            </div>
            <div className="col-md-3">
                <ShiftList
                    shifts={this.state.hoverShifts}
                    staff={this.props.staff} />
            </div>
        </div>
    }
}