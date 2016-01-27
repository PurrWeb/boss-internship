import expect from "expect"
import RotaShiftsReducer from "./rota-shifts-reducer"

describe("RotaShiftsReducer", function(){
    it("Can replace all shifts at once", function(){
        var initialState = {
            items: []
        };
        var action = {
            type: "REPLACE_ALL_SHIFTS",
            shifts: [{hello: "world"}, {hi: "earth"}]
        };
        var expectedResultState = {
            items: [{hello: "world"}, {hi: "earth"}]
        }

        expect(RotaShiftsReducer(initialState, action)).toEqual(expectedResultState);
    });

    it("Can add a shift that has been saved successfully", function(){
        var initialState = {
            items: []
        }
        var action = {
            type: "ADD_SHIFT_SUCCESS",
            shift: {id: 123, staff_id: 1000}
        };
        var expectedResultState = {
            items: [{id: 123, staff_id: 1000}],
        }

        expect(RotaShiftsReducer(initialState, action)).toEqual(expectedResultState);
    });

    it("Can update a shift", function(){
        var initialState = {
            items: [{
                id: 123,
                staff_id: 1000,
                starts_at: new Date(2015, 0, 1, 9, 0, 0),
                ends_at: new Date(2015, 0, 1, 14, 0, 0)
            }]
        }

        var newStartsAt = new Date(2015, 0, 1, 10, 0, 0);
        var newEndsAt = new Date(2015, 0, 1, 16, 0, 0);
        var action = {
            type: "UPDATE_SHIFT_SUCCESS",
            shift: {
                shift_id: 123,
                starts_at: newStartsAt,
                ends_at: newEndsAt
            }
        };
        var expectedResultState = {
            items: [{
                id: 123,
                staff_id: 1000,
                starts_at: newStartsAt,
                ends_at: newEndsAt
            }]
        }

        expect(RotaShiftsReducer(initialState, action)).toEqual(expectedResultState);
    })

    it("Can delete a shift", function(){
        var initialState = {
            items: [{
                id: 123
            }]
        };
        var action = {
            type: "DELETE_SHIFT_SUCCESS",
            shift_id: 123
        }
        var expectedResultState = {
            items: []
        }

        expect(RotaShiftsReducer(initialState, action)).toEqual(expectedResultState);
    })
});

