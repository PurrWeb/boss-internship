import React, { Component } from "react"
import ShiftTimeInput from "./shift-time-input.js"
import validation from "~lib/validation"
import ErrorMessage from "~components/error-message.js"

export default class ShiftTimeSelector extends Component {
    constructor(props){
        super(props);
        var {starts_at, ends_at} = props.defaultShiftTimes;
        this.state = {starts_at, ends_at};
    }
    render(){
        return <div>
            <div className="row">
                <div className="large-shrink small-12 column">
                    <label>Start</label>
                    <ShiftTimeInput
                        startsAt={this.state.starts_at}
                        rotaDate={this.props.rotaDate}
                        readonly={this.props.readonly}
                        showErrorMessages={this.props.showErrorMessages}
                        granularityInMinutes={this.props.granularityInMinutes}
                        onChange={(newValue) => {
                            this.onChange("starts_at", newValue);
                        } } />
                </div>
                <div className="large-shrink small-12 column">
                    <label>End</label>
                    <ShiftTimeInput
                        endsAt={this.state.ends_at}
                        readonly={this.props.readonly}
                        rotaDate={this.props.rotaDate}
                        showErrorMessages={this.props.showErrorMessages}
                        granularityInMinutes={this.props.granularityInMinutes}
                        onChange={(newValue) => {
                            this.onChange("ends_at", newValue);
                        } } />
                </div>
            </div>
            {this.getErrorMessages()}
        </div>
    }
    getErrorMessages(){
        if (this.props.showErrorMessages === false) {
            return null;
        }

        var granularityInMinutes =  this.props.granularityInMinutes;
        if (!granularityInMinutes) {
            granularityInMinutes = 30;
        }

        var errorMessages = validation.validateShiftTimes({
            starts_at: this.state.starts_at,
            ends_at: this.state.ends_at,
            granularityInMinutes
        }).messages;

        if (errorMessages.length === 0){
            return null;
        }

        return <div style={{marginTop: 10}}>
            <ErrorMessage>
                {errorMessages.map(
                    (message) => <div key={message}>{message}</div>
                )}
            </ErrorMessage>
        </div>
    }
    /**
     * @param  {string} startOrEnd - "starts_at" or "ends_at"
     */
    onChange(startOrEnd, newValue){
        this.setState({[startOrEnd]: newValue}, () => {
            var info = {
                starts_at: this.state.starts_at,
                ends_at: this.state.ends_at
            };
            info[startOrEnd] = newValue;

            this.props.onChange(info);
        });
    }
}
