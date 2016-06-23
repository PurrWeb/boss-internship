import { clockInOutAppFetchAppData } from "./clocking"

var actionTypes = [];

actionTypes.push("SET_API_KEY")
export function setApiKey({apiKey}){
    return {
        type: "SET_API_KEY",
        apiKey
    }
}

export function setApiKeyAndFetchClockInOutAppData(apiKey){
    return function(dispatch){
        dispatch(setApiKey({apiKey}));
        dispatch(clockInOutAppFetchAppData())
    }
}

export {actionTypes}
