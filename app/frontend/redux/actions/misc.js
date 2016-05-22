export function setApiKey({apiKey}){
    return {
        type: "SET_API_KEY",
        apiKey
    }
}

export function setPageOptions(options) {
    return {
        type: "SET_PAGE_OPTIONS",
        pageOptions: options.pageOptions
    }
}


// Since we have lots of data it's cumbersome to create a new actionCreators for each
// data type. So I removed the individual actionCreators and we're now
// only using a generic one.
export function genericReplaceAllItems(data){
    var keys = _.keys(data);
    if (keys.length !== 1) {
        throw Error("Invalid data for genericReplaceAllItems, only one set of values allowed")
    }

    var collectionName = keys[0];
    var items = data[collectionName]
    return {
        type: "GENERIC_REPLACE_ALL_ITEMS",
        [collectionName]: items
    }
}
