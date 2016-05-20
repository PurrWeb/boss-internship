import makeReducer from "./make-reducer"

export default makeReducer({
        SET_PAGE_OPTIONS: function(state, action){
            return action.pageOptions
        }
})
