import oFetch from "o-fetch"
import makeReducer from "./make-reducer"

export default makeReducer({
    CLOCK_IN_OUT_APP_ENTER_USER_MODE_SUCCESS: function(state, action){
        return {
            token: oFetch(action, "token"),
            mode: oFetch(action, "mode")
        }
    }
}, {
    initialState: {
        mode: "user",
        token: null
    }
})
