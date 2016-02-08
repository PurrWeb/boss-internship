import _ from "underscore"

export default function renderTooltipHtml(data){
    const { shiftsByStaffType, staffTypes, selectedStaffTypeTitle } = data;

    function renderLine(staffType){
        var shifts = shiftsByStaffType[staffType];
        var staffTypeObject = staffTypes[staffType];
        var isSelected = selectedStaffTypeTitle === staffTypeObject.name;

        var line = shifts.length + " - " + staffTypeObject.name;
        if (isSelected) {
            line = "<b>" + line + "</b>";
        }
        return line;
    }

    var selectedStaffType = _(staffTypes).find({name: selectedStaffTypeTitle}).id;

    var tooltipLines = [];
    tooltipLines.push(
        renderLine(selectedStaffType)
    );

    _(shiftsByStaffType).each(function(shifts, staffType){
        if (staffType == selectedStaffType) {
            return;
        }
        tooltipLines.push(
            renderLine(staffType)
        );
    });

    return tooltipLines.join("<br>");
}