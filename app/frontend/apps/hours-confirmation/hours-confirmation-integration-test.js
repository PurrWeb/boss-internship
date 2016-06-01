import React from "react"
import expect from "expect"
import { simpleRender } from "~lib/test-helpers"
import ReactDOM from "react-dom"
import TestUtils from "react-addons-test-utils"
import HoursConfirmationApp from "./index"
import Promise from "bluebird"
import _ from "underscore"

import "~lib/load-underscore-mixins"

describe('Hours Confirmation Integration Test', function() {
    var viewData = {
        venues: [{
            "id": 1,
            "name": "McCooley's"
        }],
        pageOptions: {
            venue: {id: 1}
        },
        clockInDays: [
            {
                id: 22,
                date: "2016-11-01",
                staff_member: {id: 160},
                venue: {id: 1}
            }
        ],
        clockInStatuses: [
            {
                staff_member: {id: 160},
                status: "on_break"
            }
        ],
        clockInPeriods: [
            {
                id: 2333,
                starts_at: new Date(2016, 10, 1, 9, 0).toString(),
                ends_at: new Date(2016, 10, 1, 18, 0).toString(),
                clock_in_day: {id: 22}
            },
            {
                id: 12222,
                starts_at: new Date(2016, 10, 2, 1, 0).toString(),
                ends_at: null,
                clock_in_day: {id: 22}
            }
        ],
        hoursAcceptancePeriods: [{
            id: 11,
            starts_at: new Date(2016, 10, 1, 9, 30).toString(),
            ends_at: new Date(2016, 10, 1, 18, 0).toString(),
            reason_note: "custom note entered here",
            hours_acceptance_reason: {id: 912},
            clock_in_day: {id: 22},
            status: "pending",
        }],
        clockInEvents: [
            {
                id: 11,
                type: "clock_in",
                time: new Date(2016, 10, 1, 9, 0).toString(),
                clock_in_period: {id: 2333}
            }, {
                id: 22,
                type: "start_break",
                time: new Date(2016, 10, 1, 10, 30).toString(),
                clock_in_period: {id: 2333}
            }, {
                id: 33,
                type: "end_break",
                time: new Date(2016, 10, 1, 11, 30).toString(),
                clock_in_period: {id: 2333}
            }, {
                id: 44,
                type: "clock_out",
                time: new Date(2016, 10, 1, 18, 0).toString(),
                clock_in_period: {id: 2333}
            }, {
                id: 55,
                type: "clock_in",
                time: new Date(2016, 10, 2, 1, 0).toString(),
                clock_in_period: {id: 12222}
            }, {
                id: 66,
                type: "start_break",
                time: new Date(2016, 10, 2, 2, 30).toString(),
                clock_in_period: {id: 12222}
            }
        ],
        hoursAcceptanceReasons: [
            {
                id: "599",
                text: "Came in early"
            },
            {
                id: "912",
                text: "Other"
            }
        ],
        rotaShifts: [
            {
                id: 1122,
                starts_at: new Date(2016, 10, 1, 10,0).toString(),
                ends_at: new Date(2016, 10, 1, 16, 0).toString(),
                staff_member: {id: 160},
                rota: {id: 16}
            }
        ],
        rotas: [
            {
                id: 16,
                venue: {id: 1},
                date: "2016-11-1"
            }
        ],
        clockInBreaks: [
            {
                id:22,
                clock_in_day: {id: 22},
                starts_at: new Date(2016, 10, 1, 10, 30).toString(),
                ends_at: new Date(2016, 10, 1, 11, 30).toString(),
                clock_in_period: {id: 2333}
            },
            {
                id: 33,
                clock_in_day: {id: 22},
                starts_at: new Date(2016, 10, 2, 2, 30).toString(),
                ends_at: null,
                clock_in_period: {id: 12222}
            }
        ],
        hoursAcceptanceBreaks: [
            {
                id:24,
                clock_in_day: {id: 22},
                starts_at: new Date(2016, 10, 1, 10, 15).toString(),
                ends_at: new Date(2016, 10, 1, 11, 45).toString(),
                hours_acceptance_period: {id: 11}
            }
        ],
        staffMembers: [
            {
                id: 160,
                avatar_url: "https://jsmbars-assets-boss-production.s3.amazonaws.com/uploads/staff_member/avatar/160/avatar.jpg",
                staff_type: {id: 8},
                first_name: "John",
                surname: "Smith",
                preferred_hours: "48",
                preferred_days: "Full time",
                holidays: [],
                venues: [{id: 1}]
            }
        ],
        staffTypes: [{
            id:8,
            url:"http://localhost:3000/api/v1/staff_types/1",
            name:"Bar Back",
            color:"#fd4949"
        }],
        clockInNotes: [
            {
                id: 33,
                text: "came in late",
                clock_in_day: {id: 22}
            },{
                id: 88,
                text: "extra work from 8pm to midnight",
                clock_in_day: {id: 22}
            }
        ]
    };

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
                hours_acceptance_reason: {id: 912},
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

        var {$$} = simpleRender(<HoursConfirmationApp viewData={viewData} />);
        var forceClockoutButton = $$("[data-test-marker-force-clock-out]")[0];
        expect(forceClockoutButton).toNotBe(undefined)

        expect.spyOn($, "ajax").andReturn(Promise.resolve(clockoutResponseData))

        TestUtils.Simulate.click(forceClockoutButton)

        _.defer(function(){
            expect($.ajax.calls.length).toBe(1);
            expect($$("[data-test-marker-force-clock-out]").length).toBe(0);
            expect($$("[data-test-marker-hours-acceptance-period-item]").length).toBe(2);
            $.ajax.restore();
            done()
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
