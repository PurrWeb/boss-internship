import React, { Component } from "react"

export default class StaffTypeBadge extends Component {
    static propTypes = {
        staffTypeObject: React.PropTypes.object.isRequired
    };
    render(){
        const staffType = this.props.staffTypeObject;
        const staffTypeForClassName = staffType.name.toLowerCase().replace(' ', '-');

        return (
            <div className={`info-table__label info-table__label_${staffTypeForClassName}`}>
                {staffType.name}
            </div>
        );
    }
}