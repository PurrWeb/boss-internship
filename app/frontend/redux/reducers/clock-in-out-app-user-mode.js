import oFetch from "o-fetch"

export default function clockInOutAppUserMode(state={
    mode: "user",
    token: null
}, action){
    switch(action.type) {
        case "CLOCK_IN_OUT_APP_ENTER_USER_MODE_SUCCESS":
            return {
                token: oFetch(action, "token"),
                mode: oFetch(action, "mode")
            }
    }
    return state;
}
