import moment from "moment"
import deepEqual from "deep-equal"
import _ from "underscore"
import { fromJS, Map, List, Set } from 'immutable';
import numeral from 'numeral';
import safeMoment from '~/lib/safe-moment';
import oFetch from 'o-fetch';
import { extendMoment } from 'moment-range';

export const BOSS_VENUE_TYPE = 'normal';
export const SECURITY_VENUE_TYPE = 'security';

const momentRange = extendMoment(moment);

numeral.register('locale', 'en-gb', {
  delimiters: {
    thousands: ',',
    decimal: '.',
  },
  abbreviations: {
    thousand: 'k',
    million: 'm',
    billion: 'b',
    trillion: 't',
  },
  ordinal: function(number) {
    var b = number % 10;
    return ~~((number % 100) / 10) === 1 ? 'th' : b === 1 ? 'st' : b === 2 ? 'nd' : b === 3 ? 'rd' : 'th';
  },
  currency: {
    symbol: '£',
  },
});

numeral.locale('en-gb');

function replaceFunctionPropsWithStrings(obj){
    return _(obj).mapValues(function(value){
        if (typeof value === "function") {
            return value.toString();
        }
        return value;
    })
}

const API_DATE_FORMAT = 'DD-MM-YYYY';
var utils =  {
    moneyFormat(amount) {
      return numeral(amount).format('$0,0.00');
    },
    colorizedAmount(amount, negative = 'red', positive = 'green', byDefault = 'black') {
      return amount < 0
        ? negative
        : amount > 0
          ? positive
          : byDefault;
    },
    getDaysCountFromInterval(uiStartDate, uiEndDate) {
      const mStartDate = safeMoment.uiDateParse(uiStartDate);
      const mEndDate = safeMoment.uiDateParse(uiEndDate);

      return mEndDate.diff(mStartDate, 'days') + 1;
    },
    parseHTML(html) {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || div.innerText || "";
    },
    calculateStaffRotaShift: function(staffMember, shifts, rotas, venues) {
      const weekRotaShifts = shifts
        .filter(shift => shift.get('staff_member') === staffMember.get('id'))
        .map(rotaShift => {
          const rota = rotas.find(rota => rota.get('id') === rotaShift.get('rota'));
          const venue = venues.find(venue => venue.get('id') === rota.get('venue'));
          return rotaShift.set('venueName', venue.get('name'));
        });
      const hoursOnWeek = weekRotaShifts
        .reduce((result, shift) => {
          const starts_at = safeMoment.iso8601Parse(shift.get('starts_at'));
          const ends_at = safeMoment.iso8601Parse(shift.get('ends_at'));
          return ends_at.diff(starts_at, 'minutes') / 60 + result;
        }, 0);
        return {weekRotaShifts, hoursOnWeek};
    },
    calculateSecurityRotaShift: function(staffMember, shifts, rotas, venues) {
      const weekRotaShifts = shifts
        .filter(shift => shift.get('staffMemberId') === staffMember.get('id'))
        .map(rotaShift => {
          let venue = Map();
          if (rotaShift.get('venueType') === BOSS_VENUE_TYPE) {
            const rota = rotas.find(rota => {
              return rota.get('id') === rotaShift.get('rota')});
            venue = venues.find(venue => rota && (venue.get('id') === rota.get('venue')) && venue.get('type') === BOSS_VENUE_TYPE);
          } else if (rotaShift.get('venueType') === SECURITY_VENUE_TYPE) {
            venue = venues.find(venue => venue.get('id') === rotaShift.get('securityVenueId') && venue.get('type') === SECURITY_VENUE_TYPE);
          } else {
            throw new Error('Unknow venue type');
          }

          return rotaShift
                      .set('venueName', venue.get('name'))
                      .set('venueId', venue.get('id'));
        });
      const hoursOnWeek = weekRotaShifts
        .reduce((result, shift) => {
          const starts_at = safeMoment.iso8601Parse(shift.get('startsAt'));
          const ends_at = safeMoment.iso8601Parse(shift.get('endsAt'));
          return ends_at.diff(starts_at, 'minutes') / 60 + result;
        }, 0);
      const weekVenueIds = weekRotaShifts.reduce((set, shift) => {
        return set.add(`${shift.get('venueType')}_${shift.get('venueId')}`);
      }, new Set());
        return {weekRotaShifts, hoursOnWeek, weekVenueIds};
    },
    parseQueryString: function( queryString ) {
      let params = {}, queries, temp, i, l;
      queries = queryString.split("&");

      for ( i = 0, l = queries.length; i < l; i++ ) {
          temp = queries[i].split('=');
          params[temp[0]] = temp[1];
      }

      return params;
    },
    insertUrlParams: function(params) {
      return Object.keys(params).filter(function(k) {
        return (params[k] !== undefined) && (params[k] !== null);
      }).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
      }).join('&')
    },
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
    humanDateFormatWithTime(){
      return 'HH:mm ddd DD-MM-YYYY';
    },
    //Deprecated: Prefer direct use of apiDateFormat
    formatRotaUrlDate(date){
        return moment(date).format(API_DATE_FORMAT);
    },
    apiDateFormat: API_DATE_FORMAT,
    commonDateFormat: 'DD-MM-YYYY',
    monthDateFormat: 'dddd',
    tableDateFormat: 'DD MMM YYYY',
    slashDateFormat: 'DD/MM/YYYY',
    commonDateFormatWithTime(){
      return 'HH:mm DD-MM-YYYY';
    },
    commonDateFormatTimeOnly(){
      return 'HH:mm';
    },
    commonDateFormatCalendar(){
      return 'ddd DD-MM-YYYY';
    },
    humanDateFormatWithDayOfWeek(){
      return 'HH:mm ddd DD/MM/YYYY';
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
    staffMemberFilter(searchQuery, staffMembers) {
      const searchQueryFilters = searchQuery.split(' ').filter(i => i);

      return searchQueryFilters.reduce((staffMembers, filter) => {
        const lowerFilter = filter.toLowerCase();
        const initial = fromJS([]);
        return staffMembers.reduce((result, staffMember) => {
          const fullName = `${staffMember.get('first_name')} ${staffMember.get('surname')}`;
          if (fullName.toLowerCase().indexOf(lowerFilter) >= 0) {
            return result.push(staffMember);
          }
          return result;
        }, initial);
      }, staffMembers);
    },
    staffMemberFilterCamelCase(searchQuery, staffMembers) {
      const searchQueryFilters = searchQuery.split(' ').filter(i => i);

      return searchQueryFilters.reduce((staffMembers, filter) => {
        const lowerFilter = filter.toLowerCase();
        const initial = fromJS([]);
        return staffMembers.reduce((result, staffMember) => {
          const fullName = `${staffMember.get('firstName')} ${staffMember.get('surname')}`;
          if (fullName.toLowerCase().indexOf(lowerFilter) >= 0) {
            return result.push(staffMember);
          }
          return result;
        }, initial);
      }, staffMembers);
    },
    staffMemberFilterFullName(searchQuery, staffMembers) {
      const searchQueryFilters = searchQuery.split(' ').filter(i => i);

      return searchQueryFilters.reduce((staffMembers, filter) => {
        const lowerFilter = filter.toLowerCase();
        const initial = fromJS([]);
        return staffMembers.reduce((result, staffMember) => {
          const fullName = staffMember.get('fullName');
          if (fullName.toLowerCase().indexOf(lowerFilter) >= 0) {
            return result.push(staffMember);
          }
          return result;
        }, initial);
      }, staffMembers);
    },
    round(number, precision) {
      const shift = (number, precision, reverseShift) => {
        if (reverseShift) {
          precision = -precision;
        }
        const numArray = ("" + number).split("e");
        return +(numArray[0] + "e" + (numArray[1] ? (+numArray[1] + precision) : precision));
      };
      return shift(Math.round(shift(number, precision, false)), precision, true);
    },
    formatDateForHoliday(holiday) {
      let startDate = safeMoment.uiDateParse(oFetch(holiday, 'start_date'));
      let endDate = safeMoment.uiDateParse(oFetch(holiday, 'end_date'));
      let dates;

      if (startDate === endDate) {
        dates = startDate.format('ddd DD MMM YYYY');
      } else if (startDate.format('YYYY') === endDate.format('YYYY')) {
        dates = startDate.format('ddd DD MMM YYYY') + ' - ' + endDate.format('ddd DD MMM');
      } else {
        dates = startDate.format('ddd DD MMM YYYY') + ' - ' + endDate.format('ddd DD MMM YYYY');
      }

      return dates;
    },
    getBuisnessDay(mDate) {
      const newMDate = mDate.clone();
      if (newMDate.hours() >= 0 && newMDate.hours() <= 7 && newMDate.minutes() <= 59) {
        newMDate.subtract(1, 'day');
      }
      return newMDate.hours(8).startOf('hour');
    },
    intervalRotaDatesFormat(mStartsAt, mEndsAt) {
      const dayFormat = 'ddd DD/MM/YYYY';
      const hoursFormat = 'HH:mm';
      const mBuisnessDay = this.getBuisnessDay(mStartsAt);

      return `${mBuisnessDay.format(dayFormat)} ${mStartsAt.format(hoursFormat)} - ${mEndsAt.format(hoursFormat)}`;
    },
    shiftRequestIntervalFormat(mStartsAt, mEndsAt) {
      const hoursFormat = 'HH:mm';
      return `${mStartsAt.format(hoursFormat)} - ${mEndsAt.format(hoursFormat)}`;
    },
    shiftRequestDayFormat(mStartsAt) {
      const dayFormat = 'ddd DD/MM/YYYY';
      const mBuisnessDay = this.getBuisnessDay(mStartsAt);
      return `${mBuisnessDay.format(dayFormat)}`;
    },
    getDiffFromRotaDayInMinutes(mStartsAt, mEndsAt) {
      const beginningOfRotaDay = this.getBuisnessDay(mStartsAt);
      const startMinutes = safeMoment.iso8601Parse(mStartsAt).diff(beginningOfRotaDay, 'minutes');
      const endMinutes = safeMoment.iso8601Parse(mEndsAt).diff(beginningOfRotaDay, 'minutes');

      return { startMinutes, endMinutes };
    },
    shiftInRotaWeek(params) {
      const mWeekStartDate = oFetch(params, 'mWeekStartDate').hours(8);
      const mWeekEndDate = oFetch(params, 'mWeekEndsDate').add(1, 'day').hours(8);
      const mShiftStartsAt = oFetch(params, 'mShiftStartsAt');
      const mShiftEndsAt = oFetch(params, 'mShiftEndsAt');

      const rotaWeek = momentRange.range(mWeekStartDate, mWeekEndDate);
      const rotaShift = momentRange.range(mShiftStartsAt, mShiftEndsAt);

      return rotaWeek.contains(rotaShift);
    },
    addZeroToNumber(number, zeroLimit = 9) {
      return number <= zeroLimit ? `0${number}` : `${number}`;
    },
    formattedTime(timeInMs) {
      const hours = Math.trunc(timeInMs / 1000 / 60 / 60);
      const minutes = Math.trunc((timeInMs / 1000 / 60) % 60);

      if (hours === 0 && minutes === 0) {
        return 0;
      }
      return `${hours === 0 ? '' : `${hours}h`}${
        minutes === 0 ? '' : `${this.addZeroToNumber(minutes, 9)}m`
      }`;
    },
    getTimeDiff(startsAt, endsAt) {
      if (endsAt === null) return 0;
      const mStartsAt = safeMoment.iso8601Parse(startsAt).seconds(0);
      const mEndsAt = safeMoment.iso8601Parse(endsAt).seconds(0);
      return mEndsAt.diff(mStartsAt);
    },
    getStartsEndsTimeDiff(items) {
      return items.reduce((acc, item) => {
        const startsAt = oFetch(item, 'startsAt');
        const endsAt = oFetch(item, 'endsAt');
        return acc + this.getTimeDiff(startsAt, endsAt);
      }, 0);
    }
}

export default utils;
