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
    stringContains: function(string, maybeContainedString){
        return string.indexOf(maybeContainedString) !== -1
    },
    secondsToTime(secs){
        let hours = Math.floor(secs / (60 * 60));

        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);

        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);

        let obj = {
        "m": minutes,
        "s": seconds
        };
        return obj;
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
    addDaysToDate(date, days){
      let result = new Date();
      result.setTime(
        date.getTime() + (days * 24 * 60 * 60 * 1000)
      );
      return result;
    },
    addHoursToDate(date, hours){
      let result = new Date();
      result.setTime(
        date.getTime() + (hours * 60 * 60 * 1000)
      );
      return result;
    },
    beginningOfRotaDay(date){
      let beginningOfCalendarDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      let calendarDayRotaStartTime = this.addHoursToDate(beginningOfCalendarDay, 8);

      if (date < calendarDayRotaStartTime) {
        return this.addDaysToDate(calendarDayRotaStartTime, -1)
      } else {
        return calendarDayRotaStartTime;
      }
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
    (Not sure if this is even necessary. Won't the updated functions be called
    even if the UI hasn't been re-rendered?)
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
    indexByClientId(array){
        return _.indexBy(array, "clientId");
    },
    // http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
    formatMoney(x) {
        // add thousand separators and show 2 decimal digits
        return x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    parseMoney(x){
        return parseFloat(x.replace(/,/g,""))
    },
    datesAreEqual(date1, date2){
        return moment(date1).format("DD-MM-YYYY") === moment(date2).format("DD-MM-YYYY");
    },
    replaceArrayElement(array, currentElement, newElement){
        array = _.clone(array);
        for (var i=0; i<array.length; i++) {
            var value = array[i];
            if (value === currentElement) {
                array[i] = newElement;
                return array;
            }
        }
        throw Error("Element not found in array")
    },
    sum(array){
        var count = 0;
        for(var i=0, n=array.length; i < n; i++) {
            count += array[i];
        }
        return count;
    },
    round(number, decimals){
        var factor = Math.pow(10, decimals);
        return Math.round(number * factor) / factor;
    },
    getStringExceptLastCharacter(str){
        return str.slice(0, str.length - 1);
    },
    capitalize(str){
        return str[0].toUpperCase() + str.slice(1)
    },
    makeAllCapsSnakeCase(str){
        var parts = str.match(/([A-Z]?[a-z]*)/g)
        parts = parts.filter(part => part !== "");
        return parts.join("_").toUpperCase();
    },
    generateQuickMenuAlias(text){
      var splitedText = text.split(' ');
      if ( splitedText.length > 1 ) {
        return splitedText[0][0] + splitedText[1][0].toLowerCase();
      } else {
        return text.slice(0,2);
      }
    },
    quickMenuHighlightResults(result, searchQuery){
      const searchQueryFilters = searchQuery.split(' ').filter(i => i);
      const uniqueFilter = searchQueryFilters.filter((v, i, a) => a.indexOf(v) === i);
      const query = new RegExp(uniqueFilter.join("|"), "gi");

      return result.map(parentItem => {
        if (parentItem.highlightedName) {
          parentItem.highlightedName = parentItem.highlightedName.replace(/(<strong style="background-color:#FF9">|<\/strong>)/ig, "");
        }
        parentItem.highlightedName = parentItem.name.replace(query, matched => {
          return `<strong style="background-color:#FF9">${matched}</strong>`
        });
        const childItems = parentItem.items.map(childItem => {
          if (childItem.highlightedDescription) {
            childItem.highlightedDescription = childItem.highlightedDescription.replace(/(<strong style="background-color:#FF9">|<\/strong>)/ig, "")
          }
          childItem.highlightedDescription = childItem.description.replace(query, matched => {
            return `<strong style="background-color:#FF9">${matched}</strong>`
          });
          return childItem;
        });
        parentItem.items = childItems;
        return parentItem;
      });
    },
    quickMenuFilter(searchQuery, quickMenu){
      const searchQueryFilters = searchQuery.split(' ').filter(i => i);
      let result = []; 

      result = searchQueryFilters.reduce((menu, filter) => {
        const lowerFilter = filter.toLowerCase();
        return menu.map((parentItem) => {
          let items = [];
          if (parentItem.name.toLowerCase().indexOf(lowerFilter) >= 0) {
            items = parentItem.items;
          } else {
            items = parentItem.items.filter(childItem => {
              const lowerDescription = childItem.description.toLowerCase();
              return lowerDescription.indexOf(lowerFilter) >= 0;
            });
          }
          return {
            name: parentItem.name,
            color: parentItem.color,
            items: items
          };
        });
      }, quickMenu).filter(i => !!i.items.length);
      return result;
    },
}

export default utils;
