import _ from "underscore"

export function setApiKey({apiKey}){
    return {
        type: "SET_API_KEY",
        apiKey
    }
}

export function setPageOptions(options) {
    return {
        type: "SET_PAGE_OPTIONS",
        pageOptions: options.pageOptions
    }
}
