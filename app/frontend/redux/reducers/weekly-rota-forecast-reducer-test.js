import weeklyForecastReducer from "./weekly-rota-forecast-reducer"
import expect from "expect"

weeklyForecastReducer = weeklyForecastReducer.reducer

describe("weeklyForecastReducer", function(){
    it("Can update the weekly rota", function(){
        var initalState = {
            needsUpdate: false,
            forecast: null
        };

        var action = {
            type: "REPLACE_WEEKLY_ROTA_FORECAST",
            weeklyRotaForecast: {
                "some": "value"
            }
        }

        var expectedResultState = {
            needsUpdate: false,
            forecast: {
                "some": "value"
            }
        };

        expect(weeklyForecastReducer(initalState, action)).toEqual(expectedResultState);
    });
    it("Resets the weekly rota forecast when an individual forecast has been updated", function(){
        var initalState = {
            needsUpdate: false,
            forecast: {
                "some": "value"
            }
        }

        var action = {
            type: "UPDATE_ROTA_FORECAST_SUCCESS"
        }

        var expectedResultState = {
            needsUpdate: true,
            forecast: null
        }

        expect(weeklyForecastReducer(initalState, action)).toEqual(expectedResultState);
    })
});
