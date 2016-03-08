import rotasReducer from "./rotas-reducer"
import expect from "expect"

describe("rotasReducer", function(){
    it("Can update the status of a rota", function(){
        var initalState = {
            "r8": {
                id: 8,
                clientId: "r8",
                status: "in_progress"
            }
        }

        var action = {
            type: "UPDATE_ROTA_STATUS_SUCCESS",
            rotaId: 8,
            status: "finished"
        }

        var expectedResultState = {
            "r8": {
                id: 8,
                clientId: "r8",
                status: "finished"
            }
        }

        expect(rotasReducer(initalState, action)).toEqual(expectedResultState);
    });
});