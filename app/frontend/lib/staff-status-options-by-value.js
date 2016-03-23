import _ from "underscore"

var staffStatusOptions = [{
        value: "clocked_in",
        title: "Clocked In",
        color: "green"
    }, {
        value: "on_break",
        title: "On break",
        color: "orange"
    }, {
        value: "clocked_out",
        title: "Clocked out",
        color: "gray"
    }
];

var staffStatusOptionsByValue = _.indexBy(staffStatusOptions, "value");

export default staffStatusOptionsByValue