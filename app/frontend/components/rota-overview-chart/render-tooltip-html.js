import _ from "underscore"

export default function renderTooltipHtml(data){
    const { shiftsByGroup, groupsById, selectedGroupTitle } = data;

    function renderLine(groupId){
        var shifts = shiftsByGroup[groupId];
        var groupObject = groupsById[groupId];
        var isSelected = selectedGroupTitle === groupObject.name;

        var line = shifts.length + " - " + groupObject.name;
        if (isSelected) {
            line = "<b>" + line + "</b>";
        }
        return line;
    }

    var selectedGroup = _(groupsById).find({name: selectedGroupTitle}).id;

    var tooltipLines = [];
    tooltipLines.push(
        renderLine(selectedGroup)
    );

    _(shiftsByGroup).each(function(shifts, group){
        if (group == selectedGroup) {
            return;
        }
        tooltipLines.push(
            renderLine(group)
        );
    });

    return tooltipLines.join("<br>");
}