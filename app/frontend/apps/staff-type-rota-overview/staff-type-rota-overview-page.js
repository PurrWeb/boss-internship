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

rotaDetails.venues = utils.indexById([{"id":1,"url":"http://localhost:3000/api/v1/venues/1","name":"McCooley's","staff_members":[{"id":1,"url":"http://localhost:3000/api/v1/staff_members/1"}]},{"id":2,"url":"http://localhost:3000/api/v1/venues/2","name":"Soho","staff_members":[]},{"id":3,"url":"http://localhost:3000/api/v1/venues/3","name":"Level","staff_members":[]},{"id":4,"url":"http://localhost:3000/api/v1/venues/4","name":"Black Rabbit","staff_members":[]},{"id":5,"url":"http://localhost:3000/api/v1/venues/5","name":"Cinema Paradiso","staff_members":[]},{"id":6,"url":"http://localhost:3000/api/v1/venues/6","name":"Peacock","staff_members":[]},{"id":7,"url":"http://localhost:3000/api/v1/venues/7","name":"Brooklyn Mixer","staff_members":[]},{"id":8,"url":"http://localhost:3000/api/v1/venues/8","name":"Blind Tiger","staff_members":[]},{"id":9,"url":"http://localhost:3000/api/v1/venues/9","name":"Lago","staff_members":[]},{"id":10,"url":"http://localhost:3000/api/v1/venues/10","name":"Fusion","staff_members":[]},{"id":11,"url":"http://localhost:3000/api/v1/venues/11","name":"Smokie Mo's","staff_members":[]},{"id":12,"url":"http://localhost:3000/api/v1/venues/12","name":"Rubber Soul","staff_members":[]},{"id":13,"url":"http://localhost:3000/api/v1/venues/13","name":"Dragonfly","staff_members":[]},{"id":14,"url":"http://localhost:3000/api/v1/venues/14","name":"Level Bolton","staff_members":[]},{"id":15,"url":"http://localhost:3000/api/v1/venues/15","name":"Heaven","staff_members":[]}])




                return <div>
                    <StaffTypeRotaOverviewItem
                        dateOfRota={new Date(rotaDetails.date)}
                        rotaShifts={shifts}
                        venues={rotaDetails.venues}
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
