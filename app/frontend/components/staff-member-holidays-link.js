import React from "react"
import { appRoutes } from "~lib/routes"

export default class StaffMemberHolidaysLink extends React.Component {
    static propTypes = {
        staffMemberServerId: React.PropTypes.any.isRequired,
        className: React.PropTypes.string
    };
    render(){
        return <a
                href={appRoutes.staffMemberHolidays(this.props.staffMemberServerId)}
                className={this.props.className}
        >
            {this.props.children}
        </a>
    }
}