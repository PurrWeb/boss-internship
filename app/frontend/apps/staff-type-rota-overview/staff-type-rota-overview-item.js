import React, { Component } from "react"
import moment from "moment"
import RotaOverviewChart from "~components/rota-overview-chart"
import { appRoutes } from "~lib/routes"

export default class StaffTypeRotaOverviewItem extends Component {
    static propTypes = {
        dateOfRota: React.PropTypes.instanceOf(Date).isRequired,
        rotaShifts: React.PropTypes.array.isRequired,
        staff: React.PropTypes.object.isRequired,
        staffTypes: React.PropTypes.object.isRequired,
        staffTypeSlug: React.PropTypes.string.isRequired
    }
    render() {
        var dateOfRota = this.props.dateOfRota;
        return <div>
            <a href={appRoutes.staffTypeRota({staffTypeSlug: this.props.staffTypeSlug, dateOfRota})}>
                <h2>{moment(dateOfRota).format("ddd D MMMM YYYY")}</h2>
            </a>    
            <div className="row">
                <div className="col-md-9">
                    TODO
                    {/* <RotaOverviewChart
                        staff={this.props.staff}
                        shifts={this.props.rotaShifts}
                        dateOfRota={dateOfRota}
                        staffTypes={this.props.staffTypes}
                        onHoverShiftsChange={() => null}
                        onSelectionShiftsChange={() => null} /> */ }
                </div>
                <div className="col-md-3">
                    
                </div>
            </div>
        </div>   
    }
}