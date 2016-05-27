import utils from "~lib/utils"
import {apiRequestActionTypes} from "../create-api-request-action"
import * as rotaActions from "./rotas"
import * as confirmationMessageActions from "./user-action-confirmation-messages"
import * as rotaForecastActions from "./rota-forecasts"
import * as confirmationModalActions from "./confirmation-modal"
import * as shiftActions from "./shifts"
import * as appDataActions from "./app-data"
import * as staffMemberActions from "./staff-members"
import * as clockingActions from "./clocking"
import * as hoursAcceptancePeriodActions from "./hours-acceptance-periods"
import * as miscActions from "./misc"
import DatabaseFactory from "../database-factory"

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

import dataHandlersOrReducerFunctions from "../data-handler-registration"

for (var name in dataHandlersOrReducerFunctions) {
    var value = dataHandlersOrReducerFunctions[name];

        window.ddd = dataHandlersOrReducerFunctions
        window.name = name;
        window.vvv =value

    databaseFactory.registerReducer(name, value.reducer);
    databaseFactory.registerActionTypes(value.actionTypes)
    databaseFactory.registerActionCreators(value.actionCreators)

}

var actionCreators;

export function registerActionCreator(name, fn){
    if (!actionCreators) {
        actionCreators = {};
    }

    actionCreators[name] = fn;
}

export function getActionCreators(){
    return databaseFactory.getActionCreators();
}

export default databaseFactory

window.debug = window.debug || {};
window.debug.actionCreators = databaseFactory.getActionCreators()
window.debug.actionTypes = databaseFactory.getActionTypes();

export {databaseFactory}
