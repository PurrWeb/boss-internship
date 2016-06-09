import React from "react"
import AppComponent from "../app-component"
import StaffTypeRotaOverviewPage from "./staff-type-rota-overview-page"
import actionCreators from "~redux/actions"
import { processStaffTypeRotaOverviewObject } from "~lib/backend-data/process-backend-objects";

export default class StaffTypeRotaOverviewApp extends AppComponent {
    render() {
        var viewData = this.getViewData();

        return <StaffTypeRotaOverviewPage
            rotaDetailsObjects={viewData.securityRotaOverviews.map(processStaffTypeRotaOverviewObject)}
            staffTypeSlug={viewData.staffTypeSlug} />
    }
}
