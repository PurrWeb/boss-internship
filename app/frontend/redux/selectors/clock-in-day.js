import _ from "underscore"
import utils from "~lib/utils"
import getRotaFromDateAndVenue from "~lib/get-rota-from-date-and-venue"
import {
    selectIsForceClockingOutClockInDay,
    selectEditHoursAcceptancePeriodIsInProgress
} from "./api-requests"

export function selectClockInDay(state, {staffMemberClientId, date}) {
    var clockInDay = _.find(state.clockInDays, function(clockInDay){
        return clockInDay.staff_member.clientId === staffMemberClientId &&
            utils.datesAreEqual(clockInDay.date, date)
    })

    if (!clockInDay) {
        throw Error("ClockInDay for staffMember " + staffMemberClientId + " and date " +
          date.toString() + "not found")
    }

    return clockInDay;
}

function addBreaksToClockInPeriod(clockInPeriod, clockInBreaks){
    var breaks = _(clockInBreaks).filter(function(clockInBreak){
        return clockInBreak.clock_in_period.clientId === clockInPeriod.clientId
    })
    return Object.assign({}, clockInPeriod, { breaks })
}

function addBreaksToHoursAcceptancePeriod(hoursAcceptancePeriod, hoursAcceptanceBreaks){
    var breaks = _(hoursAcceptanceBreaks).filter(function(hoursAcceptanceBreak){
        return hoursAcceptanceBreak.hours_acceptance_period.clientId === hoursAcceptancePeriod.clientId
    })
    return Object.assign({}, hoursAcceptancePeriod, { breaks })
}

export function selectClockInDayDetails(state, clockInDay){
    var staffMember = clockInDay.staff_member.get(state.staffMembers);
    var clockInDay = {...clockInDay}
    clockInDay.forceClockoutIsInProgress = selectIsForceClockingOutClockInDay(state, staffMember.clientId)

    var clockInPeriods = _(state.clockInPeriods).filter(function(clockInPeriod){
        return clockInPeriod.clock_in_day.clientId === clockInDay.clientId;
    });
    var hoursAcceptancePeriods = _(state.hoursAcceptancePeriods).filter(function(hoursAcceptancePeriod){
        return hoursAcceptancePeriod.clock_in_day.clientId === clockInDay.clientId;
    })

    clockInPeriods = clockInPeriods.map(function(clockInPeriod){
        return addBreaksToClockInPeriod(clockInPeriod, state.clockInBreaks)
    })
    hoursAcceptancePeriods = hoursAcceptancePeriods.map(function(hoursAcceptancePeriod){
        return addBreaksToHoursAcceptancePeriod(hoursAcceptancePeriod, state.hoursAcceptanceBreaks)
    })
    hoursAcceptancePeriods.forEach(function(hoursAcceptancePeriod){
        hoursAcceptancePeriod.updateIsInProgress = selectEditHoursAcceptancePeriodIsInProgress(state, hoursAcceptancePeriod)
    })

    let generateIfNotFound = true;

    var rota = getRotaFromDateAndVenue({
        dateOfRota: clockInDay.date,
        venueId: clockInDay.venue.clientId,
        rotas: state.rotas,
        generateIfNotFound
    })

    var rotaedShifts = _(state.rotaShifts).filter(function(shift){
        return shift.rota.clientId === rota.clientId && shift.staff_member.clientId === staffMember.clientId
    })

    var clockInEvents = _(state.clockInEvents).filter(function(clockInEvent){
        var clockInPeriod = clockInEvent.clock_in_period.get(state.clockInPeriods)
        return clockInPeriod.clock_in_day.clientId === clockInDay.clientId
    })

    var clockInNotes = _(state.clockInNotes).filter(function(clockInNote){
        return clockInNote.clock_in_day.clientId === clockInDay.clientId;
    })

    return {
        clockedClockInPeriods: clockInPeriods,
        hoursAcceptancePeriods: hoursAcceptancePeriods,
        clockInEvents,
        staffMember,
        rotaedShifts,
        clockInNotes,
        clockInDay
    }
}
