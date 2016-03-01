import React from "react"
import store from "~redux/store.js"
import StaffTypeRotaOverviewPage from "./staff-type-rota-overview-page.js"
import * as actionCreators from "~redux/actions.js"

export default class StaffTypeRotaOverviewApp extends React.Component {
    render() {
        return <StaffTypeRotaOverviewPage
            rotaDetailsObjects={this.getRotaDetailsObjects()}
            staffTypeSlug={this.getStaffTypeSlug()} />
    }
    getRotaDetailsObjects(){
        return window.boss.securityRotaOverviews;
    }
    getStaffTypeSlug(){
        return window.boss.staffTypeSlug;
    }
}
