import React, { Component } from "react"

export default class StaffTypeBadge extends Component {
    static propTypes = {
        staffTypeObject: React.PropTypes.object.isRequired
    };
    render(){
        const staffType = this.props.staffTypeObject;

        return (
            <div
                    className="info-table__label"
                    style={{backgroundColor: staffType.color}}
            >
                {staffType.name}
            </div>
        );
    }
}