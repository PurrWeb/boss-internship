import React from "react"
import expect from "expect"
import { simpleRender } from "~lib/test-helpers"
import HolidayReportApp from "./holiday-report-app"
import TestUtils from "react-addons-test-utils"

import "~lib/load-underscore-mixins"

describe('StaffListItem', function() {
    var viewData = {
        staffTypes: [{
            name: "Kitchen",
            id: 4
        }],
        venues: [{
            name: "The Bar",
            id: 3
        }], 
        staffMembers: [{
            first_name: "John",
            surname: "Smith",
            id: 50,
            holidays: [{id: 9}],
            staff_type: {id: 4}
        }],
        holidays: [{
            id: 9,
            start_date: "2016-03-10",
            end_date: "2016-03-10",
            holiday_type: "unpaid_holiday",
            days: 1,
            staff_member: {id: 50}
        }],
        pageData: {
            venueId: null,
            weekStartDate: "2016-03-07",
            weekEndDate: "2016-03-13"
        }
    };

    it("Show a staff member with one unpaid holiday on the 10th March", function(){
        var {$, $$} = simpleRender(<HolidayReportApp viewData={viewData} />);

        expect($$(".staff-list-item").length).toBe(1);
        expect($("[data-test-marker-unpaid-holidays]").textContent).toContain("10 Mar");
    });

    it("Still shows a staff member after searching for 'John'", function(){
        var { $, $$ } = simpleRender(<HolidayReportApp viewData={viewData} />);
        
        TestUtils.Simulate.change(
            $("[data-test-marker-staff-text-search]"),
            {target: {value: "John"}}
        );

        expect($$(".staff-list-item").length).toBe(1);
    })

    it("Still shows a staff member after searching for 'Sally'", function(){
        var { $, $$ } = simpleRender(<HolidayReportApp viewData={viewData} />);
        debugger
        TestUtils.Simulate.change(
            $("[data-test-marker-staff-text-search]"),
            {target: {value: "Sally"}}
        );

        expect($$(".staff-list-item").length).toBe(0);
    })
});