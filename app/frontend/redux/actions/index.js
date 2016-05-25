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
    setApiKey,
    genericReplaceAllItems,
    setPageOptions
} from "./misc"
export {
    setApiKey,
    genericReplaceAllItems,
    setPageOptions
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

var actionCreators = {};

export function createActionCreator(name, fn){
    if (actionCreators[name] !== undefined) {
        throw Error("Action creator " + name + " already existss")
    }
    actionCreators[name] = fn;
}

export default actionCreators;
