import React from "react"
import utils from "~lib/utils"
import getHoursPeriodStats from "~lib/get-hours-period-stats"
import moment from "moment"

export default class StaffDayHeader extends React.Component {
    render(){
        var { staffMember, rotaDate, clockedClockInPeriods, acceptedClockInPeriods, rotaedShifts } = this.props;
        var rotaedClockInPeriods = rotaedShifts.map(function(shift){
            return {
                starts_at: shift.starts_at,
                ends_at: shift.ends_at,
                breaks: []
            }
        })

        var getDifferenceMessage = function(differenceHours){
          let resultFragments = ["("];

          if (differenceHours == 0) {
            resultFragments.push(differenceHours + "h");
          } else if(differenceHours > 0) {
            resultFragments.push("+" + differenceHours + "h");
          } else {
            resultFragments.push("" + differenceHours + "h");
          }
          resultFragments.push(")");

          return resultFragments.join('');
        };

        var getDifferenceClass = function(differenceHours){
          let result = "";
          if( differenceHours > 0) {
            result = 'text-success';
          } else if( differenceHours < 0 ){
            result = "text-danger";
          }
          return result;
        };

        var clockInBreaks = this.props.clockInBreaks;
        var clockedStats = getHoursPeriodStats({
            denormalizedHoursPeriods: clockedClockInPeriods
        });
        var acceptedStats = getHoursPeriodStats({
            denormalizedHoursPeriods: acceptedClockInPeriods
        });
        var rotaedStats = getHoursPeriodStats({
            denormalizedHoursPeriods: rotaedClockInPeriods
        });
        let differenceHours = utils.round(rotaedStats.hours - acceptedStats.hours, 2);
        let differenceMessage = getDifferenceMessage(differenceHours);
        let differenceClass = getDifferenceClass(differenceHours);

        return <h2 style={{
                fontSize: 20,
                margin: 0,
                marginBottom: 10,
                borderBottom: "1px solid #eee",
                paddingBottom: 5
            }}>
            <div style={{display: "inline-block"}}>
                {staffMember.first_name} {staffMember.surname}
            </div>
            <div style={{
                display: "inline-block",
                fontWeight: "normal",
                marginLeft: 4,
                color: "#999",
                fontSize: 16
            }}>
                {rotaedStats.hours}h rotaed, {clockedStats.hours}h clocked, {acceptedStats.hours}h accepted <span className={ differenceClass }>{differenceMessage}</span>
            </div>
            <div style={{float: "right"}}>
                {moment(rotaDate.startTime).format("DD MMM YYYY")}
            </div>
        </h2>
    }
}
