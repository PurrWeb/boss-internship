import _ from "underscore"

var staffStatusOptions = {
    "clocked_in": {
        title: "Clocked In",
        color: "green"
    },
    "on_break": {
        title: "On Break",
        color: "red"
    },
    "clocked_out": {
        title: "Clocked Out",
        color: "blue"
    }
};
staffStatusOptions = _.mapValues(staffStatusOptions, function(status, statusKey){
    status.id = statusKey;
    return status;
});

export default staffStatusOptions;
