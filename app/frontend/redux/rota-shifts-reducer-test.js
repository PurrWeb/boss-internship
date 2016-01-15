import expect from "expect"
import RotaShiftsReducer from "./rota-shifts-reducer"

describe("RotaShiftsReducer", function(){
    it("Can replace all shifts at once", function(){
        var initialState = {
            items: [],
            shiftsBeingSavedByStaffId: {}
        };
        var action = {
            type: "REPLACE_ALL_SHIFTS",
            shifts: [{hello: "world"}, {hi: "earth"}]
        };
        var expectedResultState = {
            items: [{hello: "world"}, {hi: "earth"}],
            shiftsBeingSavedByStaffId: {}
        }

        expect(RotaShiftsReducer(initialState, action)).toEqual(expectedResultState);
    });
});