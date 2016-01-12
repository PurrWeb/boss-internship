import React, { Component } from "react"

export default class StaffStatusBadge {
    static propTypes = {
        status: React.PropTypes.string.isRequired
    }
    static contextTypes = {
        staffStatusOptions: React.PropTypes.object.isRequired
    }
    render(){
        var option = this.context.staffStatusOptions[this.props.status];
        var style = {
            backgroundColor: option.color
        };
        console.log(option)
        return <div className="staff-badge" style={style}>
            {option.title}
        </div>
    }
}