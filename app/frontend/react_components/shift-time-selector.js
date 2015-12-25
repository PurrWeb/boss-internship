import React, { Component } from "react"
import ShiftTimeInput from "./shift-time-input.js"

export default class ShiftTimeSelector extends Component {
    constructor(props){
        super(props);
        var {starts_at, ends_at} = props.defaultShiftTimes;
        this.state = {starts_at, ends_at}
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
                                if (!dateIsValid) {return;}
                                this.setState({starts_at: newValue});
                                this.props.onChange({
                                    starts_at: newValue,
                                    ends_at: this.state.ends_at
                                })
                            } } />
                    </div>
                    <div className="col-md-6">
                        <ShiftTimeInput
                            endsAt={this.state.ends_at}
                            defaultDate={this.props.defaultShiftTimes.ends_at}
                            onChange={(newValue, dateIsValid) => {
                                if (!dateIsValid) {return;}
                                this.setState({ends_at: newValue});
                                this.props.onChange({
                                    starts_at: this.state.starts_at,
                                    ends_at: newValue
                                })
                            } } />
                    </div>
                </div>
            </div>
        </div>
    }
}
