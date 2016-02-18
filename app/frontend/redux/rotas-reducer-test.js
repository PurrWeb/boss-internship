import rotasReducer from "./rotas-reducer"
import expect from "expect"

describe("rotasReducer", function(){
    it("Can update the status of a rota", function(){
        var initalState = {
            8: {
                id: 8,
                status: "in_progress"
            }
        }

        var action = {
            type: "UPDATE_ROTA_STATUS_SUCCESS",
            rotaId: 8,
            status: "finished"
        }

        var expectedResultState = {
            8: {
                id: 8,
                status: "finished"
            }
        }

        expect(rotasReducer(initalState, action)).toEqual(expectedResultState);
    });
});