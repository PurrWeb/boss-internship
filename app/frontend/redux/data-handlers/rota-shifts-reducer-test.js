import expect from "expect"
import RotaShiftsReducer from "./rota-shifts-reducer"

RotaShiftsReducer = RotaShiftsReducer.reducer

describe("RotaShiftsReducer", function(){
    it("Can replace all shifts at once", function(){
        var initialState = {};
        var action = {
            type: "REPLACE_ALL_ROTA_SHIFTS",
            rotaShifts: {
                1: {hello: "world"},
                2: {hi: "earth"}
            }
        };
        var expectedResultState = {
            1: {hello: "world"},
            2: {hi: "earth"}
        }

        expect(RotaShiftsReducer(initialState, action)).toEqual(expectedResultState);
    });

    it("Can add a shift that has been saved successfully", function(){
        var initialState = {}
        var action = {
            type: "ADD_SHIFT_SUCCESS",
            shift: {clientId: 123, staff_id: 1000}
        };
        var expectedResultState = {
            123: {
                clientId: 123,
                staff_id: 1000
            }
        }

        expect(RotaShiftsReducer(initialState, action)).toEqual(expectedResultState);
    });

    it("Can update a shift", function(){
        var initialState = {
            123: {
                clientId: 123,
                staff_id: 1000,
                starts_at: new Date(2015, 0, 1, 9, 0, 0),
                ends_at: new Date(2015, 0, 1, 14, 0, 0),
                shift_type: "standby"
            }
        }

        var newStartsAt = new Date(2015, 0, 1, 10, 0, 0);
        var newEndsAt = new Date(2015, 0, 1, 16, 0, 0);
        var action = {
            type: "UPDATE_SHIFT_SUCCESS",
            shift: {
                clientId: 123,
                starts_at: newStartsAt,
                ends_at: newEndsAt,
                shift_type: "normal"
            }
        };
        var expectedResultState = {
            123: {
                clientId: 123,
                staff_id: 1000,
                starts_at: newStartsAt,
                ends_at: newEndsAt,
                shift_type: "normal"
            }
        }

        expect(RotaShiftsReducer(initialState, action)).toEqual(expectedResultState);
    })

    it("Can delete a shift", function(){
        var initialState = {
            123: {
                clientId: 123
            }
        };
        var action = {
            type: "DELETE_SHIFT_SUCCESS",
            shiftClientId: 123
        }
        var expectedResultState = {}

        expect(RotaShiftsReducer(initialState, action)).toEqual(expectedResultState);
    })
});
