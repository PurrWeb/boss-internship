import React, { Component } from "react"

export default class StaffTypeBadge extends Component {
    static propTypes = {
        staffType: React.PropTypes.number.isRequired
    }
    static contextTypes = {
        staffTypes: React.PropTypes.object.isRequired
    }
    render(){
        var staffType = this.context.staffTypes[this.props.staffType];

        var staffTypeStyle = {
            backgroundColor: staffType.color
        };
        return <div className="staff-badge" style={staffTypeStyle}>
            {staffType.name}
        </div>
    }
}