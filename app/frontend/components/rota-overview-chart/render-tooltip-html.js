import _ from "underscore"

export default function renderTooltipHtml(data){
    const { shiftsByGroupId, groupsById, selectedGroupId } = data;

    function renderLine(groupId){
        var shifts = shiftsByGroupId[groupId];
        var groupObject = groupsById[groupId];
        var isSelected = selectedGroupId === groupObject.id;

        var line = shifts.length + " - " + groupObject.name;
        if (isSelected) {
            line = "<b>" + line + "</b>";
        }
        return line;
    }

    var tooltipLines = [];
    tooltipLines.push(
        renderLine(selectedGroupId)
    );

    _(shiftsByGroupId).each(function(shifts, group){
        if (group == selectedGroupId) {
            return;
        }
        tooltipLines.push(
            renderLine(group)
        );
    });

    return tooltipLines.join("<br>");
}