import utils from "./utils";

function prefixValidationMessages(messages, prefix) {
    return messages.map((message) => prefix + message);
}

var validation = {
    validateShiftTime(shiftTime, granularityInMinutes = 30){
        var dateIsValid = utils.dateIsValid(shiftTime);
        var minutesAreMultipleOfGranularity = shiftTime.getMinutes() % granularityInMinutes === 0;

        var messages = [];
        if (!dateIsValid) {
            messages.push("Please enter a valid date.");
        } else if (!minutesAreMultipleOfGranularity) {
            messages.push("Shift times need to be given in intervals of " + granularityInMinutes + " minutes.");
        }

        return {
            isValid: dateIsValid && minutesAreMultipleOfGranularity,
            messages
        }
    },
    shiftTimeIsValid(shiftTime){
        return validation.validateShiftTime(shiftTime).isValid;
    },
    validateShiftTimes({starts_at, ends_at, granularityInMinutes}){
        var startTimeValidation = validation.validateShiftTime(starts_at, granularityInMinutes);
        var endTimeValidation = validation.validateShiftTime(ends_at, granularityInMinutes);

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
    validateBreak({breakItem, hoursPeriod}) {
        var messages = [];

        if (breakItem.starts_at < hoursPeriod.starts_at) {
            messages.push("Break can only start after shift begins")
        }
        if (breakItem.ends_at > hoursPeriod.ends_at) {
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
    validateBreaks({breaks, hoursPeriod}){
        var messages = [];
        breaks.forEach(function(breakItem){
            var res = validation.validateBreak({
                breakItem,
                hoursPeriod
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
    validateHoursPeriodsDontOverlap(hoursPeriods){
        var doOverlap = doIntervalsOverlap(hoursPeriods)

        var messages = [];
        if (doOverlap){
            messages.push("Shift times can't overlap")
        }

        return {
            isValid: messages.length === 0,
            messages
        }
    },
    validateHoursPeriod(hoursPeriod){
        var isValid = true;
        var breaks = hoursPeriod.breaks;
        var breaksValidationResult = validation.validateBreaks({
            breaks,
            hoursPeriod
        });

        if (!breaksValidationResult.isValid) {
            isValid = false;
        }

        breaks.forEach((breakItem) => {
            var breakValidation = validation.validateBreak({
                breakItem,
                hoursPeriod
            })
            if (!breakValidation.isValid) {
                isValid = false;
            }
        })

        if(hoursPeriod.starts_at > hoursPeriod.ends_at) {
            isValid = false;
        }

        return {
            messages: [],
            isValid
        }
    },
    validateHoursPeriods(hoursPeriods) {
        // hoursPeriods are either hoursAcceptancePeriods or clockInPeriods
        var isValid = true;

        if (!validation.validateHoursPeriodsDontOverlap(hoursPeriods).isValid
        ) {
            isValid = false;
        }

        hoursPeriods.forEach(function(hoursPeriod){
            if (!validation.validateHoursPeriod(hoursPeriod).isValid) {
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
