import utils from "./utils";

function prefixValidationMessages(messages, prefix) {
    return messages.map((message) => prefix + message);
}

var validation = {
    validateShiftTime(shiftTime){
        var dateIsValid = utils.dateIsValid(shiftTime);
        var minutesAreMultipleOfThirty = shiftTime.getMinutes() % 30 === 0;

        var messages = [];
        if (!dateIsValid) {
            messages.push("Please enter a valid date.");
        } else if (!minutesAreMultipleOfThirty) {
            messages.push("Shift times need to be given in intervals of 30 minutes.");
        }

        return {
            isValid: dateIsValid && minutesAreMultipleOfThirty,
            messages
        }
    },
    shiftTimeIsValid(shiftTime){
        return validation.validateShiftTime(shiftTime).isValid;
    },
    validateShiftTimes({starts_at, ends_at}){
        var startTimeValidation = validation.validateShiftTime(starts_at);
        var endTimeValidation = validation.validateShiftTime(ends_at);

        var timesAreValid = startTimeValidation.isValid && endTimeValidation.isValid;
        var shiftEndsAfterItStarts = starts_at < ends_at;

        var messages = [];
        if (!timesAreValid) {
            messages = messages
                .concat(prefixValidationMessages(startTimeValidation.messages, "Start time: "))
                .concat(prefixValidationMessages(endTimeValidation.messages, "End time: "));
        } else if (!shiftEndsAfterItStarts) {
            messages.push("Shift end time has to be after shift start time.")
        }

        return {
            messages,
            isValid: timesAreValid && shiftEndsAfterItStarts
        }
    },
    areShiftTimesValid(starts_at, ends_at) {
        return validation.validateShiftTimes({starts_at, ends_at}).isValid;
    },
    validateBreak({breakItem, amendedClockInPeriod}) {
        var messages = [];

        if (breakItem.starts_at <= amendedClockInPeriod.starts_at) {
            messages.push("Break can only start after shift begins")
        }
        if (breakItem.ends_at >= amendedClockInPeriod.ends_at) {
            messages.push("Break must end before shift end")
        }

        var endsBeforeStartTime = breakItem.ends_at <= breakItem.starts_at;
        if (endsBeforeStartTime) {
            messages.push("Break end time can't be after start time")
        }

        return {
            messages,
            isValid: messages.length === 0
        }
    },
    validateBreaks({breaks, amendedClockInPeriod}){
        var messages = [];
        breaks.forEach(function(breakItem){
            var res = validation.validateBreak({
                breakItem,
                amendedClockInPeriod
            })
            messages = messages.concat(res.messages)
        });

        if (messages.length === 0) {
            var overlapResult = this.validateBreaksDontOverlap(breaks);
            messages = messages.concat(overlapResult.messages);
        }

        return {
            messages,
            isValid: messages.length === 0
        }
    },
    validateBreaksDontOverlap(breaks) {
        var breaksOverlap = doIntervalsOverlap(breaks);

        var messages = [];
        if (breaksOverlap){
            messages = ["Breaks can't overlap"]
        }

        return {
            isValid: messages.length === 0,
            messages
        }
    },
    validateHoursAssignmentsDontOverlap({hoursAssignments}){
        var doOverlap = doIntervalsOverlap(
            _.pluck(hoursAssignments, "clockInHours")
        )

        var messages = [];
        if (doOverlap){
            messages.push("Shift times can't overlap")
        }

        return {
            isValid: messages.length === 0,
            messages
        }
    },
    validateHoursAcceptance(hoursAcceptance){
        var isValid = true;
        var breaks = hoursAcceptance.clockInHours.breaks
        var breaksValidationResult = validation.validateBreaks({
            breaks,
            acceptedHoursClockInHours: hoursAcceptance.clockInHours
        });

        if (!breaksValidationResult.isValid) {
            isValid = false;
        }

        breaks.forEach((breakItem) => {
            var breakValidation = validation.validateBreak({
                breakItem,
                acceptedHoursClockInHours: hoursAcceptance.clockInHours
            })
            if (!breakValidation.isValid) {
                isValid = false;
            }
        })

        return {
            messages: [],
            isValid
        }
    },
    validateHoursAcceptances(hoursAcceptances) {
        var isValid = true;

        if (!validation.validateHoursAssignmentsDontOverlap({hoursAssignments: hoursAcceptances}).isValid) {
            isValid = false;
        }

        hoursAcceptances.forEach(function(hoursAcceptance){
            if (!validation.validateHoursAcceptance(hoursAcceptance).isValid) {
                isValid = false;
            }
        })

        return {
            isValid,
            messages: []
        }
    }
}

function doIntervalsOverlap(intervals){
    var intervalsOverlap = false;
    intervals.forEach(function(intervalsOuter){
        intervals.forEach(function(intervalsInner){
            if (intervalsInner !== intervalsOuter) {
                if (
                    intervalsOuter.starts_at < intervalsInner.ends_at &&
                    intervalsOuter.starts_at >= intervalsInner.starts_at ) {
                        intervalsOverlap = true;
                    }
                }
        });
    });
    return intervalsOverlap
}

export default validation;
