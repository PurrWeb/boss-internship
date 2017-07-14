import expect from "expect"
import { createStore } from "redux"
import WeeklyRotaForecast from "./weekly-rota-forecast"
import { simpleRender } from "~/lib/test-helpers"
import React from "react"

describe("WeeklyRotaForecast", function(){
    beforeEach(function(){
        WeeklyRotaForecast.__Rewire__('actionCreators', {
            fetchWeeklyRotaForecast: function(){
                return {
                    fetchWeeklyRotaForecast: "was called"
                }
            }
        });
    })
    afterEach(function(){
        WeeklyRotaForecast.__ResetDependency__('actionCreators');
    })
    it("Triggers an action to fetch the forecast if it isn't in the store", function(){
        var store = createStore(function(){
            return {
                weeklyRotaForecast: {
                    needsUpdating: false, //
                    forecast: null,
                },
                componentErrors: {},
                apiRequestsInProgress: {}
            }
        });
        var dispatchSpy = expect.spyOn(store, "dispatch");

        simpleRender(<WeeklyRotaForecast store={store} startOfWeek={new Date()} />);

        expect(dispatchSpy).toHaveBeenCalledWith({fetchWeeklyRotaForecast: "was called"});
    });
})
