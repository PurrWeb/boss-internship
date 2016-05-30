import makeDataHandler from "./make-data-handler"

export default makeDataHandler("componentErrors", {
	SET_COMPONENT_ERROR: function(state, action) {
		if (action.componentId === undefined) {
			return state;
		}
		var errors = action.errors;
		return Object.assign({}, state, {[action.componentId]: errors})
	}
})
