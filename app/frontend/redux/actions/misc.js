import _ from "underscore"
import { registerActionType, registerActionCreator } from "./index"

registerActionType("SET_API_KEY")
registerActionCreator("setApiKey", function setApiKey({apiKey}){
    return {
        type: "SET_API_KEY",
        apiKey
    }
})

registerActionType("SET_PAGE_OPTIONS")
registerActionCreator("setPageOptions", function setPageOptions(options) {
    return {
        type: "SET_PAGE_OPTIONS",
        pageOptions: options.pageOptions
    }
});
