import _ from "underscore"

var actionTypes = [];

actionTypes.push("SET_API_KEY")
export function setApiKey({apiKey}){
    return {
        type: "SET_API_KEY",
        apiKey
    }
}

actionTypes.push("SET_PAGE_OPTIONS")
export function setPageOptions(options) {
    return {
        type: "SET_PAGE_OPTIONS",
        pageOptions: options.pageOptions
    }
}

export {actionTypes}
