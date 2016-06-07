import _ from "underscore"

var clockInStatusOptions = [{
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

export default _.indexBy(clockInStatusOptions, "value");
