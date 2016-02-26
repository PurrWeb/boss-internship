import weeklyForecastReducer from "./weekly-rota-forecast-reducer"
import expect from "expect"

describe("weeklyForecastReducer", function(){
    it("Can update the weekly rota", function(){
        var initalState = null;

        var action = {
            type: "REPLACE_WEEKLY_ROTA_FORECAST",
            weeklyRotaForecast: {
                "some": "value"
            }
        }

        var expectedResultState = {
            "some": "value"
        };

        expect(weeklyForecastReducer(initalState, action)).toEqual(expectedResultState);
    });
    it("Resets the weekly rota forecast when an individual forecast has been updated", function(){
        var initalState = {
            "some": "value"
        }

        var action = {
            type: "UPDATE_ROTA_FORECAST_SUCCESS"
        }

        var expectedResultState = null;

        expect(weeklyForecastReducer(initalState, action)).toBe(null);
    })
});