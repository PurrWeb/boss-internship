import PropTypes from 'prop-types';
import React from "react"
import StaffHolidaysListItem from "./staff-holidays-list-item"

export default class StaffHolidaysList extends React.Component {
    static propTypes = {
        holidays: PropTypes.array.isRequired
    }
    render(){
        return <div>
            {this.getHolidayComponents()}
            {this.getNoHolidaysMessage()}
        </div>
    }
    getHolidayComponents(){
        return this.props.holidays.map((holiday) => {
            return <StaffHolidaysListItem
                holiday={holiday}
                key={holiday.clientId} />
        });
    }
    getNoHolidaysMessage(){
        if (this.props.holidays.length > 0) {
            return null;
        }
        return <div>None this week</div>
    }
}
