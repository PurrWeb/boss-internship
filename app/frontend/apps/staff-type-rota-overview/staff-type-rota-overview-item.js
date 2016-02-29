import React, { Component } from "react"
import moment from "moment"
import RotaOverviewChart from "../rota-overview/rota-overview-chart"
import { appRoutes } from "~lib/routes"

export default class StaffTypeRotaOverviewItem extends Component {
    static propTypes = {
        rota: React.PropTypes.object.isRequired,
        rotaShifts: React.PropTypes.array.isRequired,
        staff: React.PropTypes.object.isRequired,
        staffTypes: React.PropTypes.object.isRequired,
        staffTypeRotaOptions: React.PropTypes.object.isRequired
    }
    render() {
        var staffTypeSlug = this.props.staffTypeRotaOptions.staffTypeSlug;
        var dateOfRota = this.props.rota.date;
        return <div>
            <a href={appRoutes.staffTypeRota({staffTypeSlug, dateOfRota})}>
                <h2>{moment(this.props.rota.date).format("ddd D MMMM YYYY")}</h2>
            </a>
            <div className="row">
                <div className="col-md-9">
                    <RotaOverviewChart
                        staff={this.props.staff}
                        shifts={this.props.rotaShifts}
                        dateOfRota={dateOfRota}
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