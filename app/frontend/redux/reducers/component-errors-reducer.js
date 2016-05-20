export default function componentErrors(state={}, action){
	if (action.type !== "SET_COMPONENT_ERROR") {
		return state;
	}
	if (action.componentId === undefined) {
		return state;
	}
	var errors = action.errors;
	return Object.assign({}, state, {[action.componentId]: errors})
}
