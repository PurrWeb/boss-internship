import React, { Component } from "react"
import clockInStatusOptionsByValue from "~lib/clock-in-status-options-by-value"

export default class ClockInStatusBadge extends Component {
    static propTypes = {
        clockInStatusValue: React.PropTypes.string.isRequired
    }
    render(){
        var option = clockInStatusOptionsByValue[this.props.clockInStatusValue]
        var style = {
            backgroundColor: option.color,
            display: "inline-block"
        };
        return <div className="boss-badge" style={style}>
            {option.title}
        </div>
    }
}
