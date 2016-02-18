import React, { Component } from "react"

export default class StaffTypeBadge extends Component {
    static propTypes = {
        staffTypeObject: React.PropTypes.object.isRequired
    }
    render(){
        var staffType = this.props.staffTypeObject;

        var staffTypeStyle = {
            backgroundColor: staffType.color
        };
        return <div
            className="boss-badge staff-badge"
            style={staffTypeStyle} >
            {staffType.name}
        </div>
    }
}