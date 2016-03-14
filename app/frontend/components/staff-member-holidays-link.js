import React from "react"
import { appRoutes } from "~lib/routes"

export default class StaffMemberHolidaysLink extends React.Component {
    static propTypes = {
        staffMemberId: React.PropTypes.any.isRequired
    }
    render(){
        return <a href={appRoutes.staffMemberHolidays(this.props.staffMemberId)}>
            {this.props.children}
        </a>
    }
}