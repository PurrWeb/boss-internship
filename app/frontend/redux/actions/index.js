var actionCreators;

export function registerActionCreator(name, fn){
    if (!actionCreators) {
        actionCreators = {};
    }
    if (actionCreators[name] !== undefined) {
        throw Error("Action creator " + name + " already existss")
    }
    actionCreators[name] = fn;
}


export default actionCreators;


/*
Action types work differently from the standard redux way.

This is mostly to avoid having to create generic action types.
By doing it this way we can generate actions and action types dynamically.

We retain the ability to check that we don't use the wrong
action string by checking it exists in makeReducer.

See window.debug.actionTypes to see all possible actions.
*/

export {actionTypes}

var actionTypes;
export function registerActionType(typeString){
    if (!actionTypes) {
        actionTypes = {};
    }
    actionTypes[typeString] = typeString;
}

window.debug = window.debug || {};
window.debug.actionCreators = actionCreators
window.debug.actionTypes = actionTypes;


import {
    clockInOutAppEnterUserMode,
    updateStaffStatus,
    enterUserModeWithConfirmation,
    clockInOutAppSelectStaffType,
    updateStaffStatusWithConfirmation,
    clockInOutAppFetchAppData
} from "./clocking"
export {
    clockInOutAppEnterUserMode,
    updateStaffStatus,
    clockInOutAppSelectStaffType,
    enterUserModeWithConfirmation,
    updateStaffStatusWithConfirmation,
    clockInOutAppFetchAppData
}

import {
    updateRotaStatus,
    publishRotas
} from "./rotas"
export {
    updateRotaStatus,
    publishRotas
}

import {
    showUserActionConfirmationMessage,
    hideUserActionConfirmationMessage
} from "./user-action-confirmation-messages"
export {
    showUserActionConfirmationMessage,
    hideUserActionConfirmationMessage
}

import {
    replaceWeeklyRotaForecast,
    updateRotaForecast,
    fetchWeeklyRotaForecast
} from "./rota-forecasts"
export {
    replaceWeeklyRotaForecast,
    updateRotaForecast,
    fetchWeeklyRotaForecast
}

import {
    showConfirmationModal,
    cancelConfirmationModal,
    completeConfirmationModal
} from "./confirmation-modal"
export {
    showConfirmationModal,
    cancelConfirmationModal,
    completeConfirmationModal
};

import {
    addRotaShift,
    updateRotaShift,
    deleteRotaShift
} from "./shifts"
export {
    addRotaShift,
    updateRotaShift,
    deleteRotaShift
}

import {
    loadInitialRotaAppState,
    loadInitalStaffTypeRotaAppState,
    loadInitialRotaOverviewAppState,
    loadInitialHoursConfirmationAppState
} from "./app-data"
export {
    loadInitialRotaAppState,
    loadInitalStaffTypeRotaAppState,
    loadInitialRotaOverviewAppState,
    loadInitialHoursConfirmationAppState
}

import {
    updateStaffMemberPinWithEntryModal,
    updateStaffMemberPin
} from "./staff-members"
export {
    updateStaffMemberPinWithEntryModal,
    updateStaffMemberPin
}

import {
    updateClockInBreak
} from "./clock-in-breaks"
export {
    updateClockInBreak
}
