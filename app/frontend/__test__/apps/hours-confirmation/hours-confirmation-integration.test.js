import React from "react"
import expect from "expect"
import { simpleRender } from "~/lib/test-helpers"
import ReactDOM from "react-dom"
import TestUtils from "react-dom/test-utils"
import HoursConfirmationApp from "~/apps/hours-confirmation"
import Promise from "bluebird"
import _ from "underscore"
import viewData from './view-data';
import "~/lib/load-underscore-mixins"
import * as $ from 'jquery';

window.boss = {
  store: {
    access_token: ''
  }
};
window.$ = $;
function deepClone(data){
    return JSON.parse(JSON.stringify(data))
}

describe('Hours Confirmation Integration Test', function() {
    var viewDataWhileClockedIn = deepClone(viewData)
    viewDataWhileClockedIn.clockInDays[0].status = "on_break"
    viewDataWhileClockedIn.clockInPeriods.push({
        id: 12222,
        starts_at: new Date(2016, 10, 2, 1, 0).toString(),
        ends_at: null,
        clock_in_day: {id: 22}
    })
    viewDataWhileClockedIn.clockInEvents.push({
        id: 55,
        type: "clock_in",
        time: new Date(2016, 10, 2, 1, 0).toString(),
        clock_in_period: {id: 12222}
    })
    viewDataWhileClockedIn.clockInEvents.push({
        id: 66,
        type: "start_break",
        time: new Date(2016, 10, 2, 2, 30).toString(),
        clock_in_period: {id: 12222}
    })

    it("Renders without throwing an exception", function(){
        simpleRender(<HoursConfirmationApp viewData={viewData} />);
    });

    it("Can delete an hours acceptance period", function(done){
        var {$$} = simpleRender(<HoursConfirmationApp viewData={viewData} />);
        expect($$("[data-test-marker-hours-acceptance-period-item]").length).toBe(1)

        var deleteButton = $$("[data-test-marker-delete-hours-acceptance-period]")[0]
        expect.spyOn($, "ajax").andReturn(Promise.resolve({}))

        TestUtils.Simulate.click(deleteButton)

        _.defer(function(){
            expect($$("[data-test-marker-hours-acceptance-period-item]").length).toBe(0)
            done();
        })

        $.ajax.restore();
    });

    it("Doesn't allow accepting hours while the staff member is clocked in", function(){
        var {$} = simpleRender(<HoursConfirmationApp viewData={viewDataWhileClockedIn} />);

        expect($("[data-test-marker-delete-hours-acceptance-period]")).toBe(null)
    })

    it("Shows a clockout button if the staff member is still clocked in and allows them to be clocked out", function(done){
        var clockoutResponseData = {
            status: "clocked_out",
            clock_in_period: {
                id: 12222,
                starts_at: new Date(2016, 10, 2, 1, 0).toString(),
                ends_at: new Date(2016, 10, 2, 4, 0).toString(),
                clock_in_day: {id: 22}
            },
            clock_in_breaks: [
                {
                    id: 33,
                    starts_at: new Date(2016, 10, 2, 2, 30).toString(),
                    ends_at:  new Date(2016, 10, 2, 4, 0).toString(),
                    clock_in_period: {id: 12222}
                }
            ],
            clock_in_events: [
                {
                    id: 55,
                    type: "clock_in",
                    time: new Date(2016, 10, 2, 1, 0).toString(),
                    clock_in_period: {id: 12222}
                }, {
                    id: 66,
                    type: "start_break",
                    time: new Date(2016, 10, 2, 2, 30).toString(),
                    clock_in_period: {id: 12222}
                }, {
                    id: 125,
                    type: "end_break",
                    time: new Date(2016, 10, 2, 4, 0).toString(),
                    clock_in_period: {id: 12222}
                }, {
                    id: 126,
                    type: "clock_out",
                    time: new Date(2016, 10, 2, 4, 0).toString(),
                    clock_in_period: {id: 12222}
                }
            ],
            hours_acceptance_period: {
                id: 1112,
                starts_at: new Date(2016, 10, 2, 1, 0).toString(),
                ends_at: new Date(2016, 10, 2, 4, 0).toString(),
                reason_note: "",
                clock_in_day: {id: 22},
                status: "pending"
            },
            hours_acceptance_breaks: [
                {
                    staffMember: {id: 160},
                    id: 2453,
                    clock_in_day: {id: 22},
                    starts_at: new Date(2016, 10, 2, 2, 30).toString(),
                    ends_at: new Date(2016, 10, 2, 4, 0).toString(),
                    hours_acceptance_period: {id: 1112}
                }
            ]
        }

        var {$$} = simpleRender(<HoursConfirmationApp viewData={viewDataWhileClockedIn} />);
        var forceClockoutButton = $$("[data-test-marker-force-clock-out]")[0];
        expect(forceClockoutButton).toNotBe(undefined)
        expect.spyOn($, "ajax").andReturn(Promise.resolve(clockoutResponseData))

        TestUtils.Simulate.click(forceClockoutButton)

        _.defer(function(){
            expect($.ajax.calls.length).toBe(1);
            expect($$("[data-test-marker-force-clock-out]").length).toBe(0);
            expect($$("[data-test-marker-hours-acceptance-period-item]").length).toBe(1);
            $.ajax.restore();
            done();
        })
    });

    it("Allows the user to add a new hours acceptance period", function(done){
        var {$$} = simpleRender(<HoursConfirmationApp viewData={viewData} />);
        var addHAPButton = $$("[data-test-marker-add-hours-acceptance-period]")[0]
        expect(addHAPButton).toNotBe(undefined);

        TestUtils.Simulate.click(addHAPButton)

        _.defer(function(){
            expect($$("[data-test-marker-hours-acceptance-period-item]").length).toBe(2);
            done();
        })
    })

    it("Lets the user accept an hours acceptance period", function(done){
        var acceptHAPResponse = {
            hours_acceptance_breaks: [],
            hours_acceptance_period: _.extend({}, viewData.hoursAcceptancePeriods[0], {
                status: "accepted"
            })
        };

        var {$$} = simpleRender(<HoursConfirmationApp viewData={viewData} />);
        var acceptHAPButton = $$("[data-test-marker-accept-hours-acceptance-period]")[0]
        expect(acceptHAPButton).toNotBe(undefined)

        expect.spyOn($, "ajax").andReturn(Promise.resolve(acceptHAPResponse))

        TestUtils.Simulate.click(acceptHAPButton)

        _.defer(function(){
            var hapHtml = $$("[data-test-marker-hours-acceptance-period-item]")[0].innerHTML;
            expect(hapHtml.toLowerCase()).toContain("accepted")
            $.ajax.restore();
            done()
        })
    })
});
