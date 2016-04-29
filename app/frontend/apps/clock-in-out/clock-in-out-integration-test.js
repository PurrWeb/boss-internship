import React from "react"
import expect from "expect"
import ClockInOutApp from "./clock-in-out-app"
import { simpleRender } from "~lib/test-helpers"
import ReactTestUtils from "react-addons-test-utils"
import ReactDOM from "react-dom"
import _ from "underscore"

describe("Clock In/Out Page Integration Test", function(){
    var renderedApp, getNode, $$;

    window.staffMembers = [{
        "id":2,
        "staff_type":{"id":7},
        "first_name":"Dermot",
        "surname":"O'Boyle"
    }];
    window.clockInStatuses = [{
        "staff_member":{"id":2},
        "status":"clocked_out"
    }];
    window.staffTypes = [{
        "id":7,
        "name":"Bar Supervisor",
        "color":"#bb4dff"
    }];
    window.rotaShifts = [];
    window.venues = [{
        "id":1,
        "name":"McCooley's",
        "staff_members":[{"id":2}]
    }];
    window.rotas = [{
        "id":307,
        "venue":{"id":1},
        "date":"2016-04-29",
        "status":"published"
    }];
    window.pageData = {
      rotaDate: "2016-04-29",
      rotaVenueId: 1
    }

    it("Renders without errors", function(){
        renderedApp = simpleRender(<ClockInOutApp />)
        getNode = renderedApp.getNode;
        $$ = renderedApp.$$;
    })

    it("Shows a form to input an API key", function(){
        expect($$("[data-test-marker-api-key-button]").length).toBe(1);
    })

    it("Shows a large staff type selector after loading the venue's clock in/out data", function(done){
        ReactTestUtils.Simulate.submit(getNode());

        setTimeout(function(){
            expect($$(".large-staff-type-selector__button").length).toBeGreaterThan(0);
            done();
        }, 2500)
    })

    it("Shows a list of staff members after selecting a staff type", function(){
        ReactTestUtils.Simulate.click($$(".large-staff-type-selector__button")[0]);

        expect($$(".staff-list-item--clock-in-out").length).toBeGreaterThan(0);
    })

    it("Shows a modal for pin entry after clicking on a staff member's clockin button", function(){
        ReactTestUtils.Simulate.click($$("[data-test-marker-toggle-staff-status]")[0])
        // I think the PIN modal module actually injects a new body-level element,
        // so it's not inside my component
        expect(document.querySelectorAll("[data-test-marker-pin-modal]").length).toBeGreaterThan(0);
    });

});
