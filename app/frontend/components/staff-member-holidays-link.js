import PropTypes from 'prop-types';
import React from "react"
import { appRoutes } from "~/lib/routes"

export default class StaffMemberHolidaysLink extends React.Component {
    static propTypes = {
        staffMemberServerId: PropTypes.any.isRequired,
        className: PropTypes.string,
        startDate: PropTypes.string,
        endDate: PropTypes.string
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
