import _ from "underscore"
import { registerActionType } from "./index"

registerActionType("SET_API_KEY")
export function setApiKey({apiKey}){
    return {
        type: "SET_API_KEY",
        apiKey
    }
}

registerActionType("SET_PAGE_OPTIONS")
export function setPageOptions(options) {
    return {
        type: "SET_PAGE_OPTIONS",
        pageOptions: options.pageOptions
    }
}
