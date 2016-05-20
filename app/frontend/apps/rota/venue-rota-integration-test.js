import React from "react"
import expect from "expect"
import { simpleRender } from "~lib/test-helpers"
import RotaApp from "./rota-app"
import ReactDOM from "react-dom"
import TestUtils from "react-addons-test-utils"
import { getClientId } from "~lib/backend-data/process-backend-object"

import StaffDetailsAndShifts from "~components/staff-details-and-shifts"
import ChartAndFilter from "./chart-and-filter"

import "~lib/load-underscore-mixins"

function replaceNbsp(string){
    var nbsp = String.fromCharCode(160);
    var regex = new RegExp(nbsp, "g");
    return string.replace(regex, " ");
}

describe('Venue Rota Integration Test', function() {
    const JOHN_KITCHEN_ID = 50;
    const SALLY_SECURITY_ID = 55;
    const JOHN_KITCHEN_INDEX = 0;
    const SALLY_SECURITY_INDEX = 1;
    const ROTA_ID = 766;
    var viewData = {
        rota: {
            staff_types: [{
                name: "Kitchen",
                id: 4
            },{
                name: "Security",
                id: 5
            }],
            venues: [{
                name: "The Bar",
                id: 3
            }],
            staff_members: [{
                first_name: "John",
                surname: "Smith",
                id: JOHN_KITCHEN_ID,
                holidays: [{id: 10}],
                staff_type: {id: 4}
            }, {
                first_name: "Sally",
                surname: "Jones",
                id: SALLY_SECURITY_ID,
                holidays: [],
                staff_type: {id: 5}
            }],
            rotas: [{
                id: ROTA_ID,
                venue: { id: 3 },
                date: "2016-03-10",
                status: "in_progress"
            }, {
                id: 4,
                venue: { id: 3 },
                date: "2016-03-13",
                status: "in_progress"
            }],
            rota_shifts: [{
                id: 1,
                staff_member: {id: JOHN_KITCHEN_ID},
                starts_at: "2016-03-10T12:00:00Z",
                ends_at: "2016-03-10T16:00:00Z",
                rota: {id: ROTA_ID},
                shift_type: "normal"
            },{
                id: 2,
                staff_member: {id: JOHN_KITCHEN_ID},
                starts_at: "2016-03-13T10:00:00Z",
                ends_at: "2016-03-13T11:00:00Z",
                rota: {id: 4},
                shift_type: "normal"
            },{
                id: 3,
                staff_member: {id: SALLY_SECURITY_ID},
                starts_at: "2016-03-11T02:00:00Z",
                ends_at: "2016-03-11T04:00:00Z",
                rota: {id: ROTA_ID},
                shift_type: "standby"
            }],
            holidays: [{
                days: 2,
                holiday_type: "paid_holiday",
                id: 10,
                staff_member: {id: JOHN_KITCHEN_ID},
                start_date: "2016-03-12",
                ends_date: "2016-03-13",
            }]
        },
        rotaVenueId: 3,
        rotaDate: "2016-03-10"
    };



    it("Shows two staff members in the staff finder", function(){
        var {$, $$} = simpleRender(<RotaApp viewData={viewData} />);

        expect($$(".staff-list-item").length).toBe(2);
    });

    it("Shows this week's shifts for each staff member in the staff finder", function(){
        var {$, $$} = simpleRender(<RotaApp viewData={viewData} />);

        var content = replaceNbsp($$(".staff-list-item")[JOHN_KITCHEN_INDEX].textContent);
        expect(content).toContain("10 Mar 12:00 to 16:00");
        expect(content).toContain("13 Mar 10:00 to 11:00");

        content = replaceNbsp($$(".staff-list-item")[SALLY_SECURITY_INDEX].textContent);
        expect(content).toContain("10 Mar 2:00 to 4:00");
    });

    it("Shows todays shifts in the rota chart", function(){
        var {$, $$} = simpleRender(<RotaApp viewData={viewData} />);

        expect($$("#rota-chart .rota-chart__shift").length).toBe(2);
    });

    it("Does not allow adding security shifts", function(){
        var {$, $$} = simpleRender(<RotaApp viewData={viewData} />);

        var classes = $$(".staff-list-item")[SALLY_SECURITY_INDEX].querySelector(".btn").className;
        expect(classes).toContain("disabled");
    });

    it("Allows a shift to be edited if it's clicked in the rota chart", function(){
        var {findChild, $$, component} = simpleRender(<RotaApp viewData={viewData} />);

        var chartAndFilter = findChild(ChartAndFilter.WrappedComponent);
        // We can't simulate a click on a D3 element, so use setState instead
        chartAndFilter.setState({staffToShow: getClientId(JOHN_KITCHEN_ID)});

        var detailsComponent = findChild(StaffDetailsAndShifts);
        var node = ReactDOM.findDOMNode(detailsComponent);

        expect(node.textContent).toContain("12:0016:00");
    });

    it("Can render the rota view even if the rota doesn't exist in the backend yet", function(){
        var customViewData = {...viewData};
        customViewData.rota = {...customViewData.rota};
        customViewData.rota.rota_shifts = [];
        customViewData.rota.rotas = [];

        var { getNode } = simpleRender(<RotaApp viewData={customViewData} />);
        expect(getNode().textContent).toContain("Rota for The Bar: Thu 10 March 2016")
    });

    it("Shows holidays for staff members", function(){
        var {$$} = simpleRender(<RotaApp viewData={viewData} />);

        expect($$("[data-test-marker-holiday-item]").length).toBe(1);
    })
});
