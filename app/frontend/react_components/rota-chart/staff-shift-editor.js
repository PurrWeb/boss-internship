import React, { Component } from "react"
import ShiftTimeInput from "../shift-time-input.js"
import { boundActionCreators } from "../../redux/store.js"

export default class StaffShiftEditor extends Component {
    constructor(props){
        super(props);
        this.state = {
            newStartsAt: props.shift.starts_at,
            newEndsAt: props.shift.ends_at
        }
    }
    render(){
        if (this.props.shift == null) {
            return <div />
        }

        var staff = this.getStaff();

        console.log("render shift editor", `Shift ID ${this.props.shift.id} Staff ID ${staff.id}`)

        return <div>
            <h2 className="staff-shift-editor__h2">
                {staff.first_name} {staff.surname}
            </h2>
            <div className="staff-shift-editor__staff-type">
                {staff.readable_staff_type}
            </div>

            <div>
                <div className="row">
                    <div className="col-md-4">
                        Start
                    </div>
                    <div className="col-md-4">
                        End
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <ShiftTimeInput
                            startsAt={this.props.shift.starts_at}
                            onChange={(newValue) => this.setState({newStartsAt: newValue}) } />
                    </div>
                    <div className="col-md-4">
                        <ShiftTimeInput
                            endsAt={this.props.shift.ends_at}
                            onChange={(newValue) => this.setState({newEndsAt: newValue}) } />
                    </div>
                    <div className="col-md-4">
                        <a className="btn btn-primary" onClick={() => this.updateShift()} style={{marginTop: "-4px"}}>
                            Update
                        </a>
                    </div>
                </div>
                <a onClick={() => this.deleteShift()}>
                    Delete shift
                </a>
                <br/><br/>
                <u>Preferences</u><br/>
                Weekly Hours: {staff.preferred_hours}<br/>
                {staff.preferred_days}

            </div>
        </div>
    }
    getStaff(){
        return this.props.staff[this.props.shift.staff_id];
    }
    deleteShift(){
        boundActionCreators.deleteRotaShift(this.props.shift.id);
    }
    updateShift(){
        boundActionCreators.updateRotaShift({
            starts_at: this.state.newStartsAt,
            ends_at: this.state.newEndsAt,
            shift_id: this.props.shift.id
        });
    }
}
