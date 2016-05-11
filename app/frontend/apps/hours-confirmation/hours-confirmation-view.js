import React from "react"
import StaffDay from "./containers/staff-day"
import PageHeader from "./containers/page-header"

export default class HoursConfirmationView extends React.Component {
    render(){
        return <div>
            <PageHeader/>
            <br/>
            <StaffDay />
            <StaffDay />
            <StaffDay />
            <StaffDay />
            <StaffDay />
        </div>
    }
}
