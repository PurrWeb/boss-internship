import { createStore, combineReducers, bindActionCreators } from "redux";
import _ from "underscore"
import userData from "../data/users.js"
import { DELETE_ROTA_SHIFT, REMOVE_STAFF_FROM_PROPOSED_ROTA,UPDATE_ROTA_SHIFT, ADD_STAFF_TO_PROPOSED_ROTA, ADD_ROTA_SHIFT, RESET_PROPOSED_ROTA_STAFF } from "./actions.js"
import * as actionCreators from "./actions.js"

var userDataById = _.indexBy(userData, "id");

function staff(state=[], action){
    return userDataById;
}

function proposedRotaStaff(state=[], action) {
    switch (action.type) {
        case ADD_STAFF_TO_PROPOSED_ROTA:
            return [...state, action.staff_id];
        case REMOVE_STAFF_FROM_PROPOSED_ROTA:
            return _(state).without(action.staff_id);
        case RESET_PROPOSED_ROTA_STAFF:
            return [];
    }
    return state;
}

import defaultRotaShifts from "../data/default-rota-shifts.js"

function rotaShifts(state=defaultRotaShifts, action){
    switch (action.type) {
        case ADD_ROTA_SHIFT:
            return [...state, action.rota];
        case UPDATE_ROTA_SHIFT:
            var rotaShiftIndex = _.findIndex(state, {id: action.rota.shift_id});
            var rotaShift = state[rotaShiftIndex];
            rotaShift = Object.assign({}, rotaShift, {
                starts_at: action.rota.starts_at,
                ends_at: action.rota.ends_at
            });
            return [
                ...state.slice(0, rotaShiftIndex),
                rotaShift,
                ...state.slice(rotaShiftIndex + 1)
            ];
        case DELETE_ROTA_SHIFT:
            var rotaShiftIndex = _.findIndex(state, {id: action.shift_id});
            return [
                ...state.slice(0, rotaShiftIndex),
                ...state.slice(rotaShiftIndex + 1)
            ];
    }
    return state;
}

var store = createStore(combineReducers({
    staff,
    proposedRotaStaff,
    rotaShifts
}));

// Doing this here seems easier than manually passing the bound action
// creators (or the dispatch function) all the way down the component
// hierarchy.
export const boundActionCreators = bindActionCreators(actionCreators, store.dispatch.bind(store));

export default store;
