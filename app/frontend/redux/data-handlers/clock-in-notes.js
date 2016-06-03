import makeDataHandler from "./make-data-handler"

export default makeDataHandler("clockInNotes", {
    REPLACE_ALL_CLOCK_IN_NOTES: {
        action: "replaceAll"
    },
    ADD_CLOCK_IN_NOTE_SUCCESS: {
        action: "add",
        generateActionCreator: false
    }
})
