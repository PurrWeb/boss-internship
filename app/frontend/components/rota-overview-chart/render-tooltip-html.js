import _ from "underscore"
import moment from 'moment';

export const renderTooltipTimeHtml = (data) => {
  const { groupsById, selectedGroupId, shiftDates, staff } = data;

  const group = groupsById[selectedGroupId];
  const shifts = shiftDates.shifts;

  const renderHeader = (group, shiftDates) => {
    return `
    <div class="boss-rotas-time__title">
      <span class="boss-rotas-time__label">
          <span class="boss-rotas-time__pointer" style="background-color:${group.color}"></span>
          <span class="boss-rotas-time__role">${group.name}</span>
      </span>
      <span> Roated for </span>
      <span class="boss-rotas-time__total">${moment(shiftDates.date).format("HH:mm")}</span>
    </div>    
    `;
  };

  const renderShifts = (shifts, staff) => {
    return shifts.reduce((lines, shift) => {
      const shiftStaff = shift.staff_member.get(staff);

      return lines + `
        <li class="boss-rotas-time__item">
          <p class="boss-rotas-time__interval">
              <span class="boss-rotas-time__start">${moment(shift.starts_at).format("HH:mm")}</span>
              <span> - </span>
              <span class="boss-rotas-time__end">${moment(shift.ends_at).format("HH:mm")}</span>
          </p>
          <p class="boss-rotas-time__name">${shiftStaff.first_name} ${shiftStaff.surname}</p>
        </li>      
      `;
    }, '');
  }

  return `
  <div class="boss-rotas-time">
    ${renderHeader(group, shiftDates)}
    <ul class="boss-rotas-time__list">
      ${renderShifts(shifts, staff)}
    </ul>
  </div>  
  `;
}

export const renderTooltipInfoHtml = (data) => {
    const { shiftsByGroupId, groupsById, selectedGroupId, shiftDates, currentTooltipData } = data;
    function renderLine(groupId){
        var shifts = shiftsByGroupId[groupId];
        var groupObject = groupsById[groupId];
        var isSelected = selectedGroupId === groupObject.clientId;

        let line = `
          <li class="boss-rotas-info__item">
            <span class="boss-rotas-info__pointer" style="background-color: ${groupObject.color}"></span>
            <p class="boss-rotas-info__text"><span>${groupObject.name}</span>: <span>${shifts.length}</span></p>
          </li>`;
  
        if (isSelected) {
            line = `
              <li class="boss-rotas-info__item">
                <span class="boss-rotas-info__pointer" style="background-color: ${groupObject.color}"></span>
                <p class="boss-rotas-info__text"><span><strong>${groupObject.name}</span>: <span>${shifts.length}</strong></span></p>
              </li>`;
        }

        return line;
    }

    let tooltipLines = renderLine(selectedGroupId);

    _(shiftsByGroupId).each(function(shifts, group){
        if (group == selectedGroupId) {
            return;
        }
        tooltipLines = tooltipLines + renderLine(group);
    });
    
    return `
    <div class="nvtooltip-pointer nvtooltip-pointer_position_left" style="right:100%; top:50%"></div>
    <div class="boss-rotas-info">
      <ul class="boss-rotas-info__list">
        ${tooltipLines}
      </ul>
    </div>
    `;
}
