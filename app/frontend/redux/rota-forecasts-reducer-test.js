import forecastsReducer from "./rota-forecasts-reducer"
import expect from "expect"

describe("forecastsReducer", function(){
    it("Can add a new forecast and deletes the existing one if there's already one for that rota (date+venueId)", function(){
        var initalState = {
            5: {
                id: 5,
                date: new Date(2016, 2, 1),
                venueId: 20
            }
        }

        var action = {
            type: "UPDATE_ROTA_FORECAST_SUCCESS",
            rotaForecast: {
                id: 14,
                date: new Date(2016, 2, 1),
                venueId: 20
            }
        }

        var expectedResultState = {
            14: {
                id: 14,
                date: new Date(2016, 2, 1),
                venueId: 20
            }
        }

        expect(forecastsReducer(initalState, action)).toEqual(expectedResultState);
    });

    it("Can add a new forecast that has the same ID as the previous one", function(){
        var initalState = {
            5: {
                id: 5,
                date: new Date(2016, 2, 1),
                venueId: 20
            }
        }

        var action = {
            type: "UPDATE_ROTA_FORECAST_SUCCESS",
            rotaForecast: {
                id: 5,
                date: new Date(2016, 2, 1),
                venueId: 20
            }
        }

        var expectedResultState = {
            5: {
                id: 5,
                date: new Date(2016, 2, 1),
                venueId: 20
            }
        }

        expect(forecastsReducer(initalState, action)).toEqual(expectedResultState);
    });
});