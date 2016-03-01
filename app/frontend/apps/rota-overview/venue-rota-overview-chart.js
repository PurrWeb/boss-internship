import React, { Component } from "react"
import _ from "underscore"
import RotaOverviewChart from "~components/rota-overview-chart"

export default class VenueRotaOverviewChart extends Component {
    static propTypes = {
        staff: React.PropTypes.object.isRequired,
        shifts: React.PropTypes.object.isRequired,
        dateOfRota: React.PropTypes.instanceOf(Date).isRequired,
        staffTypes: React.PropTypes.object.isRequired,
        onHoverShiftsChange: React.PropTypes.func.isRequired,
        onSelectionShiftsChange: React.PropTypes.func.isRequired
    }
    render() {
        return <RotaOverviewChart
                    staff={this.props.staff}
                    shifts={_.values(this.props.shifts)}
                    dateOfRota={this.props.dateOfRota}
                    staffTypes={this.props.staffTypes}
                    onHoverShiftsChange={this.props.onHoverShiftsChange}
                    onSelectionShiftsChange={this.props.onSelectionShiftsChange} />
    }
}