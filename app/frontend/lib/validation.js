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
    }
}

export default validation;