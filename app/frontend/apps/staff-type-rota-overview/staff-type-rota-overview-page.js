import React, { Component } from "react"
import StaffTypeRotaOverviewItem from "./staff-type-rota-overview-item"
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
          <div className="row">
            <div className="col-md-3">
              <WeekPicker
                  selectionStartDate={new Date(this.props.rotaDetailsObjects[0].date)}
                  onChange={({startDate}) =>
                      location.href = appRoutes.staffTypeRotaOverview({
                          staffTypeSlug,
                          weekStartDate: startDate
                      })
                  }/>
              </div>
              <a href={ appRoutes.securityRotaPdfDownload({ date: new Date(this.props.rotaDetailsObjects[0].date) }) } className="btn btn-success">
                <span className="glyphicon glyphicon-download"></span> Download PDF
              </a>
            </div>
            {this.props.rotaDetailsObjects.map(function(rotaDetails){
                return <StaffTypeRotaOverviewItem
                            dateOfRota={rotaDetails.date}
                            rotaShifts={rotaDetails.rota_shifts}
                            venues={utils.indexByClientId(rotaDetails.venues)}
                            rotas={utils.indexByClientId(rotaDetails.rotas)}
                            staff={utils.indexByClientId(rotaDetails.staff_members)}
                            staffTypes={utils.indexByClientId(rotaDetails.staff_types)}
                            staffTypeSlug={self.props.staffTypeSlug}
                            key={rotaDetails.date.toString()} />
            })}
        </div>
    }
}
