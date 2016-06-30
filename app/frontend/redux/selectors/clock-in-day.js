import _ from "underscore"
import utils from "~lib/utils"

export function selectClockInDay(state, {staffMemberClientId, date}) {
    var clockInDay = _.find(state.clockInDays, function(clockInDay){
        return clockInDay.staff_member.clientId === staffMemberClientId &&
            utils.datesAreEqual(clockInDay.date, date)
    })

    if (!clockInDay) {
        throw Error("ClockInDay for staffMember " + staffMemberClientId + " and date " +
          date.toString() + "not found")
    }

    return clockInDay;
}
