import moment from "moment"
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
    },
    formatRotaUrlDate(date){
        return moment(date).format("DD-MM-YYYY");
    },
    capitalizeFirstCharacter(str) {
        if (str.length === 0) {
            return str;
        }
        return str[0].toUpperCase() + str.slice(1);
    },
    formatDateForApi(date){
        return moment(date).format("DD-MM-YYYY");
    },
    stringIsJson(string){
        try {
            JSON.parse(string);
            return true
        } catch (err) {
            return false;
        }
    },
    getWeekStartDate(date){
        return moment(date).startOf("isoweek").toDate();
    },
    getWeekEndDate(date){
        return moment(date).endOf("isoweek").toDate();
    },
    indexById(array){
        return _.indexBy(array, "id");
    },
    // http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
    formatMoney(x) {
        // add thousand separators and show 2 decimal digits
        return x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    parseMoney(x){
        return parseFloat(x.replace(/,/g,""))
    }
}


export default utils;