import React from "react"
import AppComponent from "../app-component"
import StaffTypeRotaOverviewPage from "./staff-type-rota-overview-page.js"
import * as actionCreators from "~redux/actions.js"
import { processStaffTypeRotaOverviewAppViewData } from "~lib/backend-data/process-app-view-data";

export default class StaffTypeRotaOverviewApp extends AppComponent {
    render() {
        var viewData = this.getViewData();
        viewData = processStaffTypeRotaOverviewAppViewData(viewData);

        return <StaffTypeRotaOverviewPage
            rotaDetailsObjects={viewData.rotaDetailsObjects}
            staffTypeSlug={viewData.staffTypeSlug} />
    }
}
