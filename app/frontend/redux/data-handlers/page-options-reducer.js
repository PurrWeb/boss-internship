import makeDataHandler from "./make-data-handler"

export default makeDataHandler("pageOptions", {
        SET_PAGE_OPTIONS: function(state, action){
            return action.pageOptions
        }
})
