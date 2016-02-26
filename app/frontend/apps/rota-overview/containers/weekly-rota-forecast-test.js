import expect from "expect"
import { createStore } from "redux"
import WeeklyRotaForecast from "./weekly-rota-forecast"
import { simpleRender } from "~lib/test-helpers"
import React from "react"

WeeklyRotaForecast.__Rewire__('fetchWeeklyRotaForecast', function(){
    return {fetchWeeklyRotaForecast: "was called"};
});

describe("WeeklyRotaForecast", function(){
    it("Triggers an action to fetch the forecast if it isn't in the store", function(){
        var store = createStore(function(){
            return {
                weeklyRotaForecast: null,
                apiRequestsInProgress: {}
            }
        });
        var dispatchSpy = expect.spyOn(store, "dispatch");

        simpleRender(<WeeklyRotaForecast store={store} startOfWeek={new Date()} />);

        expect(dispatchSpy).toHaveBeenCalledWith({fetchWeeklyRotaForecast: "was called"});
    });
})