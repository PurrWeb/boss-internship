import deepEqual from "deep-equal"
import _ from "underscore"

function replaceFunctionPropsWithStrings(obj){
    return _(obj).mapValues(function(value){
        if (typeof value === "function") {
            return value.toString();
        }
        return value;
    })
}

var utils =  {
    stringEndsWith: function(string, suffix) {
        return string.slice(-suffix.length) == suffix;
    },
    stringStartsWith: function(string, prefix) {
        return string.slice(0, prefix.length) == prefix;
    },
    containNumberWithinRange(number, range){
        var [min, max] = range;
        if (number < min) {
            number = min;
        }
        if (number > max) {
            number = max;
        }
        return number;
    },
    dateIsValid(date) {
        return !isNaN(date.valueOf());
    },
    immutablyDeleteObjectItem(object, key){
        var ret = {...object};
        delete ret[key];
        return ret;
    },
    shiftTimeIsValid(shiftTime){
        var dateIsValid = utils.dateIsValid(shiftTime);
        var minutesAreMultipleOfFifteen = shiftTime.getMinutes() % 15 === 0;
        return dateIsValid && minutesAreMultipleOfFifteen;
    },
    /**
    This function can be used inside shouldComponentUpdate. If props contain
    functions passed in from the parent deepEqual would always say the props
    have changed, so instead of their identities we compare their string
    representations.
    **/
    deepEqualTreatingFunctionsAsStrings(expected, actual) {
        return deepEqual(
            replaceFunctionPropsWithStrings(expected),
            replaceFunctionPropsWithStrings(actual)
        );
    }
}


export default utils;