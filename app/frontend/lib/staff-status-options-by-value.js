import _ from "underscore"

var staffStatusOptions = [{
        value: "clocked_in",
        title: "Clocked In",
        color: "green",
        confirmationTitle: "clocked in"
    }, {
        value: "on_break",
        title: "On break",
        color: "orange",
        confirmationTitle: "put on break"
    }, {
        value: "clocked_out",
        title: "Clocked out",
        color: "gray",
        confirmationTitle: "clocked out"
    }
];

var staffStatusOptionsByValue = _.indexBy(staffStatusOptions, "value");

export default staffStatusOptionsByValue