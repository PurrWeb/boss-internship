import React from "react"
import store from "~redux/store.js"
import StaffTypeRotaOverviewPage from "./staff-type-rota-overview-page.js"
import * as actionCreators from "~redux/actions.js"

export default class StaffTypeRotaOverviewApp extends React.Component {
    render() {
        return <StaffTypeRotaOverviewPage
            rotaDetailsObjects={this.getRotaDetailsObjects()}
            staffTypeRotaOptions={this.getStaffTypeRotaOptions()} />
    }
    getRotaDetailsObjects(){
        return window.boss.securityRotaOverviews;
    }
    getStaffTypeRotaOptions(){
        return window.boss.pageOptions.staffTypeRota;
    }
}
