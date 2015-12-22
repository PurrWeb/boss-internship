import React, { Component } from "react"
import AddStaffToShiftButton from "./add-staff-to-shift-button"
import StaffShiftList from "../staff-shift-list.js"

export default class StaffListItem extends Component {
    constructor (props){
        super(props);
        this.state = {
            isExpanded: false
        };
    }
    render() {
        var staff = this.props.staff;
        var className = `staff-list-item ${this.state.isExpanded ? 'staff-list-item--expanded' : ''}`

        var staffTypeStyle = {
            backgroundColor: staff.staff_type_object.color
        };

        return (
            <div className={className}>
                <div className="row">
                    <div className="col-md-2 staff-list-item__image-column">
                        <img src={"http://lorempixel.com/400/400/people/?" + staff.id} style={{ width: "100%"}} />
                    </div>
                    <div className="col-md-8">
                        <div className="staff-list-item__header">
                            <h3 className="staff-list-item__name">
                                {staff.first_name} {staff.surname}
                            </h3>
                            <div className="staff-list-item__type" style={staffTypeStyle}>
                                {staff.readable_staff_type}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <h4 className="staff-list-item__h4">
                                    Shifts
                                </h4>
                                <StaffShiftList
                                    staffId={staff.id} />
                                <a onClick={() => this.toggleShowMore()}>
                                    {this.state.isExpanded ? "Show Less" : "Show More"}
                                </a>
                            </div>
                            <div className="col-md-6">
                                <h4 className="staff-list-item__h4">
                                    Preferences
                                </h4>
                                Weekly Hours: {staff.preferred_hours}<br/>
                                Day Preferences:&nbsp;
                                {staff.preferred_days}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="staff-list-item__add-button">
                            <AddStaffToShiftButton
                                staffId={staff.id}
                                addShift={this.props.addShift}
                                />
                        </div>
                    </div>
                </div>
                <div className="row staff-list-item__extra-content">
                    <div className="col-md-12">
                        No extra information available.
                    </div>
                </div>
            </div>
        );
    }
    toggleShowMore() {
        this.setState({isExpanded: !this.state.isExpanded});
    }
}
