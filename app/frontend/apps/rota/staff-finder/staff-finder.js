import React, { Component } from "react"
import _ from "underscore"
import StaffListItem from "./staff-list-item"
import StaffFinder from "~components/staff-finder"

export default class RotaStaffFinder extends Component {
    render() {
        return <div>
            <div className="staff-finder__header">
                <h3 className="staff-finder__h3">
                    Find Staff
                </h3>
                <StaffFinder
                    staffItemComponent={StaffListItem}
                    staff={this.props.staff} />
            </div>
        </div>
    }
}
