import React from "react"
import moment from "moment"

export default class StaffHolidaysListItem extends React.Component {
    static propTypes = {
        holiday: React.PropTypes.object.isRequired
    }
    render(){
        var { holiday } = this.props;
        var isSingleDayHoliday = holiday.start_date.valueOf() === holiday.end_date.valueOf();

        if (isSingleDayHoliday) {
            return <div>{this.formatHolidayDate(holiday.start_date)}</div>
        } else {
            return <div key={holiday.id}>
                {this.formatHolidayDate(holiday.start_date) + " - " + this.formatHolidayDate(holiday.end_date)}
            </div>
        }
    }
    formatHolidayDate(date){
        return moment(date).format("D MMM")
    }
}