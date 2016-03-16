import React from "react"
import expect from "expect"
import { simpleRender, NoOpComponent } from "~lib/test-helpers"
import StaffTypeRotaOverviewApp from "./index"
import ReactDOM from "react-dom"
import TestUtils from "react-addons-test-utils"

import RotaOverviewChart from "~components/rota-overview-chart"

import "~lib/load-underscore-mixins"


describe('Staff Type Rota Overview Integration Test', function() {
    beforeEach(function(){
        // Stub chart because NVD3 doesn't work without a DOM
        RotaOverviewChart.__Rewire__("RotaOverviewChartInner", NoOpComponent);
    })
    afterEach(function(){
        RotaOverviewChart.__ResetDependency__("RotaOverviewChartInner");
    })
    var viewData = {
        securityRotaOverviews: [{
            date: "2016-03-10",
            staff_types: [{
                name: "Security",
                id: 4,
                color: "red"
            }],
            staff_members: [{
                first_name: "John",
                surname: "Smith",
                id: 3,
                holidays: [],
                staff_type: {id: 4}
            }],
            rotas: [{
                id: 2,
                venue: { id: 3 },
                date: "2016-03-10",
                status: "in_progress"
            }],
            rota_shifts: [{
                id: 1,
                staff_member: {id: 3},
                starts_at: "2016-03-10T12:00:00Z",
                ends_at: "2016-03-10T16:00:00Z",
                rota: {id: 2}
            }],
            holidays: [],
            venues: [{
                name: "The Bar",
                id: 3
            }]
        }],
        staffTypeSlug: "security"
    };

    it("Renders without throwing an exception", function(){
        simpleRender(<StaffTypeRotaOverviewApp viewData={viewData} />);
    });
});