export default function pageOptions(state=null, action){
    switch(action.type) {
        case "SET_PAGE_OPTIONS":
            return action.pageOptions
    }
    return state;
}
