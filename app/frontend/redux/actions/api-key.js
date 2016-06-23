var actionTypes = [];

actionTypes.push("SET_API_KEY")
export function setApiKey({apiKey}){
    return {
        type: "SET_API_KEY",
        apiKey
    }
}

export {actionTypes}
