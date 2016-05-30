import rotasReducer from "./rotas-reducer"
import expect from "expect"

rotasReducer = rotasReducer.reducer

describe("rotasReducer", function(){
    it("Can update the status of a rota", function(){
        var initalState = {
            "r8": {
                clientId: "r8",
                status: "in_progress"
            }
        }

        var action = {
            type: "UPDATE_ROTA_STATUS_SUCCESS",
            rotaClientId: "r8",
            status: "finished"
        }

        var expectedResultState = {
            "r8": {
                clientId: "r8",
                status: "finished"
            }
        }

        expect(rotasReducer(initalState, action)).toEqual(expectedResultState);
    });



    it("Can publish all shifts in a week", function(){
        var initialState = {
            123:  {
                clientId: 123,
                date: new Date(2015,6,6),
                status: "in_progress",
                venue: {serverId: 1}
            }
        }

        var action = {
            type: "PUBLISH_ROTAS_SUCCESS",
            date: new Date(2015,6,6),
            venueServerId: 1
        }

        var expectedResultState = {
            123: {
                clientId: 123,
                date: new Date(2015,6,6),
                status: "published",
                venue: {serverId: 1}
            }
        }

        expect(rotasReducer(initialState, action)[123]).toEqual(expectedResultState[123])
    })

});
