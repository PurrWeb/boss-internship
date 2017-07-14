import React, { Component } from "react"
import clockInStatusOptionsByValue from "~/lib/clock-in-status-options-by-value"

export default class ClockInStatusBadge extends Component {
    static propTypes = {
        clockInStatusValue: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func
    };
    render(){
        const option = clockInStatusOptionsByValue[this.props.clockInStatusValue]
        const statusForSubclass = option.title.toLowerCase().replace(' ', '-');

        return (
            <div
                className={`info-table__user-status info-table__user-status_${statusForSubclass}`}
                onClick={this.props.onClick}
            >
                {option.title}
            </div>
        );
    }
}
