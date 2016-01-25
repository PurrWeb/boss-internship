import React, { Component } from "react"
import RotaOverviewChart from "./rota-overview-chart"

export default class RotaOverviewView extends Component {
    render() {
       return <RotaOverviewChart
            staff={this.props.staff}
            shifts={this.props.rotaShifts}
            dateOfRota={this.props.dateOfRota}
            staffTypes={this.props.staffTypes} />
    }
}