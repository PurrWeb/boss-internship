import React, { Component } from "react"
import moment from "moment"
import RotaOverviewChart from "../rota-overview/rota-overview-chart"

export default class StaffTypeRotaOverviewItem extends Component {
    static propTypes = {
        rota: React.PropTypes.object.isRequired,
        rotaShifts: React.PropTypes.array.isRequired,
        staff: React.PropTypes.object.isRequired,
        staffTypes: React.PropTypes.object.isRequired
    }
    render() {
        return <div>
            <h2>{moment(this.props.rota.date).format("ddd D MMMM YYYY")}</h2>
            <div className="row">
                <div className="col-md-9">
                    <RotaOverviewChart
                        staff={this.props.staff}
                        shifts={this.props.rotaShifts}
                        dateOfRota={this.props.rota.date}
                        staffTypes={this.props.staffTypes}
                        onHoverShiftsChange={() => null}
                        onSelectionShiftsChange={() => null} />
                </div>
                <div className="col-md-3">
                    
                </div>
            </div>
        </div>   
    }
}