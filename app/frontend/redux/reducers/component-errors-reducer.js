import makeReducer from "./make-reducer"

export default makeReducer({
	SET_COMPONENT_ERROR: function(state, action) {
		if (action.componentId === undefined) {
			return state;
		}
		var errors = action.errors;
		return Object.assign({}, state, {[action.componentId]: errors})
	}
})
