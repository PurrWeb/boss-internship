import { handleActions } from 'redux-actions';
import actionCreators from "~/redux/actions";
import oFetch from "o-fetch";
import { processHolidayAppViewData, processHolidayObjectV2, processStaffMemberObject } from "~/lib/backend-data/process-backend-objects";
import utils from "~/lib/utils";
import safeMoment from "~/lib/safe-moment";
import moment from 'moment';
import { extendMoment } from 'moment-range'

import {
  INITIAL_LOAD,
  ADD_HOLIDAY,
  ADD_STAFF_MEMBER,
  CALCULATE_HOLIDAYS,
  CALCULATE_STAFF_MEMBERS,
} from './constants';

const initialState = {
  staffTypes: {},
  staffMembers: {},
  holidays: {},
  venues: {},
  pageOptions: {},
  holidaysCount: {},
  staffMembersCount: null
};

export default handleActions({
  [INITIAL_LOAD]: (state, action) => {
    const data = processHolidayAppViewData(action.payload);
    const staffTypes = oFetch(data, "staffTypes");
    const staffMembers = oFetch(data, "staffMembers");
    const holidays = oFetch(data, "holidays");
    const venues = oFetch(data, "venues");
    const pageData = oFetch(data, "pageData");
    const holidaysCount = oFetch(data, "holidaysCount");
    const staffMembersCount = oFetch(data, "staffMembersCount");
    return {
        staffTypes: utils.indexByClientId(staffTypes),
        staffMembers: utils.indexByClientId(staffMembers),
        holidays: utils.indexByClientId(holidays),
        venues: utils.indexByClientId(venues),
        pageOptions: pageData,
        holidaysCount,
        staffMembersCount
    }
  },
  [ADD_HOLIDAY]: (state, action) => {
    const momentRange = extendMoment(moment);
    const {weekStartDate, weekEndDate} = state.pageOptions;
    const {start_date} = action.payload;
    const isDateBetween = momentRange
      .range(safeMoment.uiDateParse(weekStartDate), safeMoment.uiDateParse(weekEndDate))
      .contains(safeMoment.uiDateParse(start_date));
    if (isDateBetween) {
      const holiday = processHolidayObjectV2(action.payload);
      return {
        ...state,
        holidays: {
          ...state.holidays,
          ...utils.indexByClientId([holiday])
        }
      }
    }

    return state;
  },
  [ADD_STAFF_MEMBER]: (state, action) => {
    const staffMember = action.payload;
    if (!(`CLIENT_ID_${oFetch(staffMember, 'id')}` in oFetch(state, 'staffMembers'))) {
      const proccessedStaffMember = processStaffMemberObject(staffMember);
      return {
        ...state,
        staffMembers: {
          ...state.staffMembers,
          ...utils.indexByClientId([proccessedStaffMember])
        }
      }
    }
    return state;
  },
  [CALCULATE_HOLIDAYS]: (state, action) => {
    const holidays = Object.values(state.holidays);
    let holidaysCount = {};

    holidays.forEach(holiday => {
      const startDateWeekday = safeMoment.iso8601Parse(oFetch(holiday, 'start_date')).isoWeekday();
      const endDateWeekday = safeMoment.iso8601Parse(oFetch(holiday, 'end_date')).isoWeekday();
      
      for (let i = startDateWeekday; i<= endDateWeekday; i ++) {
        if (holidaysCount[i] === undefined) {
          holidaysCount[i] = 0;
        }
        holidaysCount[i] = holidaysCount[i] + 1;
      }
    });
    
    return {
      ...state,
      holidaysCount: holidaysCount
    }
  },
  [CALCULATE_STAFF_MEMBERS]: (state, action) => {
    const staffMembersCount = Object.values(state.staffMembers).length;
    return {
      ...state,
      staffMembersCount,
    }
  }
}, initialState);


