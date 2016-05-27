import utils from "~lib/utils"
import {apiRequestActionTypes} from "./create-api-request-action"
import dataHandlersOrReducerFunctions from "./data-handler-registration"
import * as rotaActions from "./actions/rotas"
import * as confirmationMessageActions from "./actions/user-action-confirmation-messages"
import * as rotaForecastActions from "./actions/rota-forecasts"
import * as confirmationModalActions from "./actions/confirmation-modal"
import * as shiftActions from "./actions/shifts"
import * as appDataActions from "./actions/app-data"
import * as staffMemberActions from "./actions/staff-members"
import * as clockingActions from "./actions/clocking"
import * as hoursAcceptancePeriodActions from "./actions/hours-acceptance-periods"
import * as miscActions from "./actions/misc"
import DatabaseFactory from "./database-factory"

var databaseFactory = new DatabaseFactory();

function registerActionsObject(actionsObject){
    for (var key in actionsObject) {
        if (utils.stringStartsWith(key, "__") || key === "default") {
            // Rewire adds some extra properties (tests only)
            continue
        }
        if (key === "setGetActionCreators") {
            // app data actionCreators need access to other actionCreators
            actionsObject.setGetActionCreators(function(){
                return databaseFactory.getActionCreators();
            })
            continue;
        }
        if (key === "actionTypes") {
            var actionTypes = actionsObject[key];
            databaseFactory.registerActionTypes(actionTypes)
        } else {
            var fn = actionsObject[key];
            databaseFactory.registerActionCreator(key, fn);
        }
    }
}

databaseFactory.registerActionTypes(apiRequestActionTypes)

registerActionsObject(clockingActions)
registerActionsObject(rotaActions)
registerActionsObject(confirmationMessageActions)
registerActionsObject(rotaForecastActions)
registerActionsObject(confirmationModalActions);
registerActionsObject(shiftActions)
registerActionsObject(appDataActions)
registerActionsObject(staffMemberActions)
registerActionsObject(hoursAcceptancePeriodActions)
registerActionsObject(miscActions)

for (var name in dataHandlersOrReducerFunctions) {
    var value = dataHandlersOrReducerFunctions[name];
    databaseFactory.registerReducer(name, value.reducer);
    databaseFactory.registerActionTypes(value.actionTypes)
    databaseFactory.registerActionCreators(value.actionCreators)
}

export function getActionCreators(){
    return databaseFactory.getActionCreators();
}

export function getRootReducer(){
    return databaseFactory.getRootReducer()
}

window.debug = window.debug || {};
window.debug.actionCreators = databaseFactory.getActionCreators()
window.debug.actionTypes = databaseFactory.getActionTypes();
