import makeDataHandler from "./make-data-handler"
import _ from 'underscore';

export default makeDataHandler("clockInDays", {
    REPLACE_ALL_CLOCK_IN_DAYS: {
        action: "replaceAll"
    },
    FORCE_STAFF_MEMBER_CLOCK_OUT_SUCCESS: {
        action: "update",
        generateActionCreator: false
    },
    UPDATE_CLOCK_IN_STATUS_SUCCESS: {
        action: "addOrUpdate"
    },
    UPDATE_CLOCK_IN_STATUS_FAILURE: {
        action: "addOrUpdate",
        shouldIgnoreAction: function(action){
            if (!action.clockInDay) {
                return true;
            }
        }
    },
    REMOVE_CLOCK_IN_DAY: function(state, action) {
      state = _(state).omit(function(clockInDay){
        return clockInDay.clientId === action.clockInDay.clientId;
      });
      return state;
    }
})
