import * as rotaActions from "./rotas"
import * as confirmationMessageActions from "./user-action-confirmation-messages"
import * as rotaForecastActions from "./rota-forecasts"
import * as confirmationModalActions from "./confirmation-modal"
import * as shiftActions from "./shifts"
import * as appDataActions from "./app-data"
import * as staffMemberActions from "./staff-members"
import * as clockingActions from "./clocking"

registerActionsObject(clockingActions)
registerActionsObject(rotaActions)
registerActionsObject(confirmationMessageActions)
registerActionsObject(rotaForecastActions)
registerActionsObject(confirmationModalActions);
registerActionsObject(shiftActions)
registerActionsObject(appDataActions)
registerActionsObject(staffMemberActions)

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






function registerActionsObject(actionsObject){
    for (var key in actionsObject) {
        var fn = actionsObject[key];
        registerActionCreator(key, fn);
    }
}
