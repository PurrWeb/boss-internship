import forecastsReducer from "./rota-forecasts-reducer"
import expect from "expect"

describe("forecastsReducer", function(){
    it("Can add a new forecast and deletes the existing one if there's already one for that rota", function(){
        var initalState = {
            5: {
                id: 5,
                rota: {
                    id: 99
                }
            }
        }

        var action = {
            type: "UPDATE_ROTA_FORECAST_SUCCESS",
            rotaForecast: {
                id: 14,
                rota: {
                    id: 99
                }
            }
        }

        var expectedResultState = {
            14: {
                id: 14,
                rota: {
                    id: 99
                }
            }
        }

        expect(forecastsReducer(initalState, action)).toEqual(expectedResultState);
    });
});