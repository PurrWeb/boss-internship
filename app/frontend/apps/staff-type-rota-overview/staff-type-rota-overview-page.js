import React, { Component } from "react"
import StaffTypeRotaOverviewItem from "./staff-type-rota-overview-item"
import * as backendData from "~redux/process-backend-data"
import utils from "~lib/utils"

export default class StaffTypeRotaOverviewPage extends Component {
    static propTypes = {
        rotaDetailsObjects: React.PropTypes.array.isRequired
    }
    render() {
        return <div>
            {this.props.rotaDetailsObjects.map(function(rotaDetails){
                var rota = backendData.processRotaObject(rotaDetails.rotas[0]);
                var shifts = rotaDetails.rota_shifts.map(backendData.processShiftObject);
                return <StaffTypeRotaOverviewItem
                    rota={rota}
                    rotaShifts={shifts}
                    staff={utils.indexById(rotaDetails.staff_members)}
                    staffTypes={utils.indexById(rotaDetails.staff_types)}
                    staffTypeRotaOptions={window.boss.pageOptions.staffTypeRota}
                    key={rota.id} />
            })}
        </div>       
    }
}
