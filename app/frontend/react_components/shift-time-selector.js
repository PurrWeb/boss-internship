import React, { Component } from "react"
import ShiftTimeInput from "./shift-time-input.js"

export default class ShiftTimeSelector extends Component {
    constructor(props){
        super(props);
        var {starts_at, ends_at} = props.defaultShiftTimes;
        this.state = {starts_at, ends_at};
    }
    render(){
        return <div>
            <div className="col-md-3">
                <div className="row">
                    <div className="col-md-6">
                        Start
                    </div>
                    <div className="col-md-6">
                        End
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <ShiftTimeInput
                            startsAt={this.state.starts_at}
                            defaultDate={this.props.defaultShiftTimes.starts_at}
                            onChange={(newValue, dateIsValid) => {
                                this.onChange("starts_at", ...arguments);
                            } } />
                    </div>
                    <div className="col-md-6">
                        <ShiftTimeInput
                            endsAt={this.state.ends_at}
                            defaultDate={this.props.defaultShiftTimes.ends_at}
                            onChange={(newValue, dateIsValid) => {
                                this.onChange("ends_at", ...arguments);
                            } } />
                    </div>
                </div>
            </div>
        </div>
    }
    /**
     * @param  {string} startOrEnd - "starts_at" or "ends_at"
     */
    onChange(startOrEnd, newValue, dateIsValid){
        if (!dateIsValid) {
            return;
        }
        this.setState({[startOrEnd]: newValue});

        var info = {
            starts_at: this.state.starts_at,
            ends_at: this.state.ends_at
        };
        info[startOrEnd] = newValue;

        this.props.onChange(info);
    }
}
