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
});