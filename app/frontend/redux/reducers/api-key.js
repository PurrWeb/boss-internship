import makeReducer from "./make-reducer"

export default makeReducer({
    SET_API_KEY: function(state, action){
        return action.apiKey;
    }
})
