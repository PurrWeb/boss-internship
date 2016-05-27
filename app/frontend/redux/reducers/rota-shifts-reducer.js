import _ from "underscore"
import utils from "~lib/utils"
import makeDataHandler from "./make-data-handler"

export default makeDataHandler("shifts", {
    REPLACE_ALL_SHIFTS: {
        action: "replaceAll"
    },
    ADD_SHIFT_SUCCESS: function(state, action){
        return Object.assign({}, state, {[action.shift.clientId]: action.shift })
    },
    UPDATE_SHIFT_SUCCESS: function(state, action) {
        var shiftClientId = action.shift.clientId;
        if (state[shiftClientId] === undefined) {
            throw new Error("Trying to update a shift that doesn't exist.");
        }
        var rotaShift = state[shiftClientId];
        // Don't do a complete replace because the new shift might contain
        // a reference to a new rota that doesn't exist on the frontend
        // in the same way yet.
        rotaShift = Object.assign({}, rotaShift, {
            starts_at: action.shift.starts_at,
            ends_at: action.shift.ends_at,
            shift_type: action.shift.shift_type
        });
        return Object.assign({}, state, {[shiftClientId]: rotaShift});
    },
    DELETE_SHIFT_SUCCESS: function(state, action){
        if (state[action.shiftClientId] === undefined) {
            throw new Error("Trying to delete a shift that no longer exists.");
        }
        return utils.immutablyDeleteObjectItem(state, action.shiftClientId);
    }
});
