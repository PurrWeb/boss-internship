import React from "react"
import { appRoutes } from "~lib/routes"

export default class StaffMemberHolidaysLink extends React.Component {
    static propTypes = {
        staffMemberServerId: React.PropTypes.any.isRequired,
        className: React.PropTypes.string,
        startDate: React.PropTypes.string,
        endDate: React.PropTypes.string
    };
    render(){
        let href = appRoutes.staffMemberHolidays(
          this.props.staffMemberServerId,
          this.props.startDate,
          this.props.endDate
        );

        return <a
                href={href}
                className={this.props.className}
        >
            {this.props.children}
        </a>
    }
}
