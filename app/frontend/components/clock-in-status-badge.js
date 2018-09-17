import PropTypes from 'prop-types';
import React, { Component } from "react"
import clockInStatusOptionsByValue from "~/lib/clock-in-status-options-by-value"

export default class ClockInStatusBadge extends Component {
    static propTypes = {
        clockInStatusValue: PropTypes.string.isRequired,
        onClick: PropTypes.func
    };
    render(){
        const option = clockInStatusOptionsByValue[this.props.clockInStatusValue]
        const statusForSubclass = option.title.toLowerCase().replace(' ', '-');

        return (
            <div
                className={`boss-info-table__user-status boss-info-table__user-status_${statusForSubclass}`}
                onClick={this.props.onClick}
            >
                {option.title}
            </div>
        );
    }
}
