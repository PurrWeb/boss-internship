import React from "react"
import AppComponent from "../app-component"
import StaffTypeRotaOverviewPage from "./staff-type-rota-overview-page.js"
import * as actionCreators from "~redux/actions.js"

export default class StaffTypeRotaOverviewApp extends AppComponent {
    render() {
        var viewData = this.getViewData();
        return <StaffTypeRotaOverviewPage
            rotaDetailsObjects={viewData.securityRotaOverviews}
            staffTypeSlug={viewData.staffTypeSlug} />
    }
}
