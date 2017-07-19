import React from "react"
import StaffDayList from "./containers/staff-day-list"
import PageHeader from "./containers/page-header"

export default class HoursConfirmationView extends React.Component {
    render(){
        return <div>
            <PageHeader/>
            <br/>
            <div className="boss-page-main__content">
              <StaffDayList displayVenues={false} displayDates={true}/>
            </div>
        </div>
    }
}
