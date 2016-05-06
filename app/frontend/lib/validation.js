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
    validateBreak({breakItem, acceptedHoursClockInHours}) {
        var messages = [];

        if (breakItem.starts_at <= acceptedHoursClockInHours.starts_at) {
            messages.push("Break can only start after shift begins")
        }
        if (breakItem.ends_at >= acceptedHoursClockInHours.ends_at) {
            messages.push("Break must end before shift end")
        }

        var endsBeforeStartTime = breakItem.ends_at <= breakItem.starts_at;

        return {
            messages,
            isValid: messages.length === 0 && !endsBeforeStartTime
        }
    },
    validateBreaksDontOverlap({breaks}) {
        var breaksOverlap = doIntervalsOverlapOrTouchEachOther(breaks);

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
        var doOverlap = doIntervalsOverlapOrTouchEachOther(
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
        var breaksValidationResult = validation.validateBreaksDontOverlap({breaks});

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

function doIntervalsOverlapOrTouchEachOther(intervals){
    var intervalsOverlap = false;
    intervals.forEach(function(intervalsOuter){
        intervals.forEach(function(intervalsInner){
            if (intervalsInner !== intervalsOuter) {
                if (
                    intervalsOuter.starts_at <= intervalsInner.ends_at &&
                    intervalsOuter.starts_at >= intervalsInner.starts_at ) {
                        intervalsOverlap = true;
                    }
                }
        });
    });
    return intervalsOverlap
}

export default validation;
