import React, { Component } from "react"

export default class StaffStatusBadge extends Component {
    static propTypes = {
        staffStatusObject: React.PropTypes.object.isRequired
    }
    render(){
        var option = this.props.staffStatusObject;
        var style = {
            backgroundColor: option.color,
            display: "inline-block"
        };
        return <div className="boss-badge" style={style}>
            {option.title}
        </div>
    }
}