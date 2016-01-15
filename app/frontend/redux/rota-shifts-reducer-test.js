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

    it("Can keep track of a shift that's being saved", function(){
        var initialState = {
            items: [],
            shiftsBeingSavedByStaffId: {}
        };
        var action = {
            type: "ADD_ROTA_SHIFT_IN_PROGRESS",
            shift: {id: 123, staff_id: 1000}
        };
        var expectedResultState = {
            items: [],
            shiftsBeingSavedByStaffId: {
                1000: [123]
            }
        }

        expect(RotaShiftsReducer(initialState, action)).toEqual(expectedResultState);
    });

    it("Throws an error when trying to save several shifts with the same ID at the same time", function(){
        var initialState = {
            items: [],
            shiftsBeingSavedByStaffId: {}
        };
        var action1 = {
            type: "ADD_ROTA_SHIFT_IN_PROGRESS",
            shift: {id: 123, staff_id: 1000}
        };
        var action2 = {
            type: "ADD_ROTA_SHIFT_IN_PROGRESS",
            shift: {id: 123, staff_id: 1000}
        };

        expect(function(){
            var stateAfterAction1 = RotaShiftsReducer(initialState, action1);
            RotaShiftsReducer(stateAfterAction1, action2);
        }).toThrow("An update for this shift is already in progress.");
    });

    it("Can add a shift that has been saved successfully", function(){
        var initialState = {
            items: [],
            shiftsBeingSavedByStaffId: {
                1000: [123]
            }
        }
        var action = {
            type: "ADD_ROTA_SHIFT_SUCCESS",
            shift: {id: 123, staff_id: 1000}
        };
        var expectedResultState = {
            items: [{id: 123, staff_id: 1000}],
            shiftsBeingSavedByStaffId: {
                1000: []
            }
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
            }],
            shiftsBeingSavedByStaffId: {}
        }

        var newStartsAt = new Date(2015, 0, 1, 10, 0, 0);
        var newEndsAt = new Date(2015, 0, 1, 16, 0, 0);
        var action = {
            type: "UPDATE_ROTA_SHIFT_SUCCESS",
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
            }],
            shiftsBeingSavedByStaffId: {}
        }

        expect(RotaShiftsReducer(initialState, action)).toEqual(expectedResultState);
    })    
});


