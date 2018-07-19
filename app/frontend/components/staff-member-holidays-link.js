import PropTypes from 'prop-types';
import React from "react"
import { appRoutes } from "~/lib/routes"
import safeMoment from "~/lib/safe-moment";

export default class StaffMemberHolidaysLink extends React.Component {
    static propTypes = {
        staffMemberServerId: PropTypes.any.isRequired,
        className: PropTypes.string,
        sStartDate: PropTypes.string,
        sEndDate: PropTypes.string
    };
    render(){
        let sStartDate = this.props.sStartDate;
        let sEndDate = this.props.sEndDate;

        let href = appRoutes.staffMemberProfileHolidaysTab(
          this.props.staffMemberServerId,
          sStartDate && safeMoment.uiDateParse(sStartDate).toDate(),
          sEndDate && safeMoment.uiDateParse(sEndDate).toDate()
        );

        return <a
                href={href}
                className={this.props.className}
        >
            {this.props.children}
        </a>
    }
}
