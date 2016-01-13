import _ from "underscore"

function color(hue){
    return `hsl(${hue}, 50%, 40%)`;
}
var staffTypes = {
    "bar_back": {
        title: "Bar Back",
        color: color(0)
    },
    "kitchen": {
        title: "Kitchen",
        color: color(40)
    },
    "bar_tender": {
        title: "Bartender",
        color: color(250)
    },
    "pr": {
        title: "PR",
        color: color(120)
    },
    "floor_staff": {
        title: "Floor Staff",
        color: color(150)
    },
    "waitress": {
        title: "Waitress",
        color: color(190)
    },
    "security": {
        title: "Security",
        color: color(210)
    },
    "manager": {
        title: "Manager",
        color: color(240)
    }
};
staffTypes = _.mapValues(staffTypes, function(staffType, staffTypeKey){
    staffType.id = staffTypeKey;
    return staffType;
});

export default staffTypes;
