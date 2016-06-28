import oFetch from "o-fetch"
import makeDataHandler from "./make-data-handler"

export default makeDataHandler("clockInOutAppUserMode", {
    CLOCK_IN_OUT_APP_ENTER_USER_MODE_SUCCESS: function(state, action){
        return {
            token: oFetch(action, "token"),
            mode: oFetch(action, "mode")
        }
    }
}, {
    initialState: {
        mode: "User",
        token: null
    }
})
