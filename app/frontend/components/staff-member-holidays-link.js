import React from "react"
import { appRoutes } from "~lib/routes"

export default class StaffMemberHolidaysLink extends React.Component {
    static propTypes = {
        staffMemberServerId: React.PropTypes.any.isRequired
    }
    render(){
        return <a href={appRoutes.staffMemberHolidays(this.props.staffMemberServerId)}>
            {this.props.children}
        </a>
    }
}