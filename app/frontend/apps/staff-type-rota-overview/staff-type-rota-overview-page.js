import React, { Component } from "react"
import StaffTypeRotaOverviewItem from "./staff-type-rota-overview-item"
import * as backendData from "~redux/process-backend-data"
import utils from "~lib/utils"
import WeekPicker from "~components/week-picker"
import { appRoutes } from "~lib/routes"

export default class StaffTypeRotaOverviewPage extends Component {
    static propTypes = {
        rotaDetailsObjects: React.PropTypes.array.isRequired,
        staffTypeSlug: React.PropTypes.string.isRequired
    }
    render() {
        var staffTypeSlug = this.props.staffTypeSlug;
        var self = this;

        return <div>
            <WeekPicker
                selectionStartDate={new Date(this.props.rotaDetailsObjects[0].date)}
                onChange={({startDate}) =>
                    location.href = appRoutes.staffTypeRotaOverview({
                        staffTypeSlug,
                        weekStartDate: startDate
                    })
                }/>
            {this.props.rotaDetailsObjects.map(function(rotaDetails){
                var shifts = rotaDetails.rota_shifts.map(backendData.processShiftObject);
                var rotas = rotaDetails.rotas.map(backendData.processRotaObject)

                return <div>
                    <StaffTypeRotaOverviewItem
                        dateOfRota={new Date(rotaDetails.date)}
                        rotaShifts={shifts}
                        venues={utils.indexById(rotaDetails.venues)}
                        rotas={utils.indexByClientId(rotas)}
                        staff={utils.indexById(rotaDetails.staff_members)}
                        staffTypes={utils.indexById(rotaDetails.staff_types)}
                        staffTypeSlug={self.props.staffTypeSlug}
                        key={rotaDetails.date.toString()} />
                    </div>
            })}
        </div>       
    }
}
