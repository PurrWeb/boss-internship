var actionTypes = []
actionTypes.push("SET_PAGE_OPTIONS")
export function setPageOptions(options) {
    return {
        type: "SET_PAGE_OPTIONS",
        pageOptions: options.pageOptions
    }
}

export {actionTypes}
