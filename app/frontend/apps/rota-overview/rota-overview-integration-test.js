import React from "react"
import expect from "expect"
import { simpleRender, NoOpComponent } from "~lib/test-helpers"
import RotaOverviewApp from "./rota-overview-app"
import _ from "underscore"
import ReactDOM from "react-dom"
import TestUtils from "react-addons-test-utils"
import Promise from "bluebird"

import RotaOverviewChart from "~components/rota-overview-chart"

import "~lib/load-underscore-mixins"

window.boss = {access_token: "tokennnn"}

describe('Venue Rota Overview Integration Test', function() {
    beforeEach(function(){
        // Stub chart because NVD3 doesn't work without a DOM
        RotaOverviewChart.__Rewire__("RotaOverviewChartInner", NoOpComponent);
    })
    afterEach(function(){
        RotaOverviewChart.__ResetDependency__("RotaOverviewChartInner");
    })
    var viewData = {
        rotas: [{
            staff_types: [{
                name: "Kitchen",
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
            rota: {
                id: 2,
                venue: { id: 3 },
                date: "2016-03-10",
                status: "in_progress"
            },
            rota_shifts: [{
                id: 1,
                staff_member: {id: 3},
                starts_at: "2016-03-10T12:00:00Z",
                ends_at: "2016-03-10T16:00:00Z",
                rota: {id: 2}
            }],
            holidays: []
        }],
        venues: [{
            name: "The Bar",
            id: 3
        }],
        rotaForecasts: [{
            "id": 13,
            "venue": { "id": 3 },
            "date": "2016-03-10",
            "forecasted_take": 4500.0,
            "total": 340.6,
            "total_percentage": 7,
            "staff_total": 246.8,
            "staff_total_percentage": 5,
            "pr_total": 0.0,
            "pr_total_percentage": 0.0,
            "kitchen_total": 93.8,
            "kitchen_total_percentage": 2,
            "security_total": 0.0,
            "security_total_percentage": 0.0
        }],
        weeklyRotaForecast: {
            "id": 13,
            "venue": { "id": 3 },
            "date": "2016-03-10",
            "forecasted_take": 4500.0,
            "total": 340.6,
            "total_percentage": 7,
            "staff_total": 246.8,
            "staff_total_percentage": 5,
            "pr_total": 0.0,
            "pr_total_percentage": 0.0,
            "kitchen_total": 93.8,
            "kitchen_total_percentage": 2,
            "security_total": 0.0,
            "security_total_percentage": 0.0
        },
        startDate: "2016-03-07",
        endDate: "2016-03-13"
    };


    it("Renders without throwing an exception", function(){
        simpleRender(<RotaOverviewApp viewData={viewData} />);
    });

    it("Updates a daily rota forecast is updated the weekly forecast is refetched", function(done){
        var dailyForecastUpdateResponse = {
            "id": 13,
            "venue": { "id": 3 },
            "date": "2016-03-10",
            "forecasted_take": 45000.0,
            "total": 340.6,
            "total_percentage": .7,
            "staff_total": 246.8,
            "staff_total_percentage": .5,
            "pr_total": 0.0,
            "pr_total_percentage": 0.0,
            "kitchen_total": 93.8,
            "kitchen_total_percentage": .2,
            "security_total": 0.0,
            "security_total_percentage": 0.0
        }

        var weeklyForecastUpdateResponse = {
            "id": 13,
            "venue": { "id": 3 },
            "date": "2016-03-10",
            "forecasted_take": 45000.0,
            "total": 340.6,
            "total_percentage": 7,
            "staff_total": 246.8,
            "staff_total_percentage": 5,
            "pr_total": 0.0,
            "pr_total_percentage": 0.0,
            "kitchen_total": 93.8,
            "kitchen_total_percentage": 2,
            "security_total": 0.0,
            "security_total_percentage": 0.0
        }

        var {$$} = simpleRender(<RotaOverviewApp viewData={viewData} />);
        var forecastedTakeInput = $$("[data-test-marker-forecasted-take]")[0]
        forecastedTakeInput.value = 45000
        TestUtils.Simulate.change(forecastedTakeInput)

        var timesAjaxCalled = 0;
        expect.spyOn($, "ajax").andCall(function(){
            timesAjaxCalled++;
            if (timesAjaxCalled === 1) {
                return Promise.resolve(dailyForecastUpdateResponse)
            } else if (timesAjaxCalled === 2) {
                return Promise.resolve(weeklyForecastUpdateResponse)
            } else {
                throw Error("More ajax requests made than expected")
            }
        })

        var forecastUpdateButton = $$("[data-test-marker-update-forecast-button]")[0];
        TestUtils.Simulate.click(forecastUpdateButton)

        _.delay(function(){
            var calls = $.ajax.calls;
            expect(calls[0].arguments[0].url).toContain("rota_forecasts/10-03-2016")
            expect(calls[1].arguments[0].url).toContain("rota_forecasts/07-03-2016/weekly")

            $.ajax.restore()
            done();
        }, 200)
    })
});
