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
          <div className="row align-top mb-lg">
            <div className="shrink column">
              <WeekPicker
                  selectionStartDate={new Date(this.props.rotaDetailsObjects[0].date)}
                  onChange={({startDate}) =>
                      location.href = appRoutes.staffTypeRotaOverview({
                          staffTypeSlug,
                          weekStartDate: startDate
                      })
                  }/>
              </div>
              <a href={ appRoutes.securityRotaPdfDownload({ date: new Date(this.props.rotaDetailsObjects[0].date) }) } className="boss3-button boss3-button_role_download">
                Download PDF
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
