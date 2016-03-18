import React from "react"
import AppComponent from "../app-component"
import StaffTypeRotaOverviewPage from "./staff-type-rota-overview-page.js"
import * as actionCreators from "~redux/actions.js"
import { processStaffTypeRotaOverviewObject } from "~redux/process-backend-data";

export default class StaffTypeRotaOverviewApp extends AppComponent {
    render() {
        var viewData = this.getViewData();
        var rotaDetailsObjects = viewData.securityRotaOverviews.map(processStaffTypeRotaOverviewObject);

        return <StaffTypeRotaOverviewPage
            rotaDetailsObjects={rotaDetailsObjects}
            staffTypeSlug={viewData.staffTypeSlug} />
    }
}
