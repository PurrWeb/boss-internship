import React, { Component } from "react"
import moment from "moment"
import RotaOverviewChart from "~components/rota-overview-chart"
import { appRoutes } from "~lib/routes"
import WeekPicker from "~components/week-picker"

export default class StaffTypeRotaOverviewItem extends Component {
    static propTypes = {
        dateOfRota: React.PropTypes.instanceOf(Date).isRequired,
        rotaShifts: React.PropTypes.array.isRequired,
        staff: React.PropTypes.object.isRequired,
        staffTypes: React.PropTypes.object.isRequired,
        staffTypeRotaOptions: React.PropTypes.object.isRequired
    }
    render() {
        var staffTypeSlug = this.props.staffTypeRotaOptions.staffTypeSlug;
        var dateOfRota = this.props.dateOfRota;
        return <div>
            <a href={appRoutes.staffTypeRota({staffTypeSlug, dateOfRota})}>
                <h2>{moment(dateOfRota).format("ddd D MMMM YYYY")}</h2>
            </a>    
            <WeekPicker
                selectionStartDate={dateOfRota}
                onChange={({startDate}) =>
                    location.href = appRoutes.staffTypeRotaOverview({
                        staffTypeSlug,
                        weekStartDate: startDate
                    })
                }/>
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