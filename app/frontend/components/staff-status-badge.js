import React, { Component } from "react"

export default class StaffStatusBadge {
    static propTypes = {
        status: React.PropTypes.string.isRequired
    }
    static contextTypes = {
        staffStatusOptions: React.PropTypes.object.isRequired
    }
    render(){
        return <div>
            {this.props.status}
        </div>
    }
}