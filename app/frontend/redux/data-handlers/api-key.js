import makeDataHandler from "./make-data-handler"

export default makeDataHandler("apiKey", {
    SET_API_KEY: function(state, action){
        return action.apiKey;
    },
    CLOCK_IN_OUT_APP_FETCH_DATA_FAILURE: function(state, action){
        return "";
    }
}, {initialState: ""})
