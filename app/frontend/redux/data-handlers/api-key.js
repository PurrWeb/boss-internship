import makeDataHandler from "./make-data-handler"

export default makeDataHandler("apiKey", {
    SET_API_KEY: function(state, action){
        return action.apiKey;
    }
})
