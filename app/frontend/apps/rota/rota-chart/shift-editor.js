import React, { Component } from "react"
import ShiftTimeSelector from "~components/shift-time-selector"
import RotaDate from "~lib/rota-date"
import utils from "~lib/utils"

export default class ShiftEditor extends Component {
    static contextTypes = {
        boundActionCreators: React.PropTypes.object,
        dateOfRota: React.PropTypes.instanceOf(Date)
    }
    constructor(props){
        super(props);
        var {starts_at, ends_at} = props.shift;
        this.state = {
            newShiftTimes: {
                starts_at, ends_at
            }
        }
    }
    render(){
        if (this.props.shift == null) {
            return <div />
        }

        var updateButtonClasses = ["btn", "btn-primary"];
        if (!this.areBothTimesValid()) {
            updateButtonClasses.push("disabled");
        }

        return <div>
            <div className="row">
                <div className="col-md-9">
                    <ShiftTimeSelector
                        defaultShiftTimes={this.props.shift}
                        rotaDate={new RotaDate(this.context.dateOfRota)}
                        onChange={(shiftTimes) => this.onShiftTimesChange(shiftTimes)}
                        dateOfRota={this.context.dateOfRota} />
                </div>
                <div className="col-md-3">
                    <br/>
                    <a className={updateButtonClasses.join(" ")} onClick={() => this.updateShift()} style={{marginTop: "-4px"}}>
                        Update
                    </a>
                </div>
            </div>
        
            <a onClick={() => this.deleteShift()}>
                Delete shift
            </a>
        </div>
    }
    areBothTimesValid(){
        var {starts_at, ends_at} = this.state.newShiftTimes;
        return utils.dateIsValid(starts_at) && utils.dateIsValid(ends_at);
    }
    deleteShift(){
        this.context.boundActionCreators.deleteRotaShift(this.props.shift.id);
    }
    onShiftTimesChange(shiftTimes) {
        this.setState({newShiftTimes: shiftTimes})
    }
    updateShift(){
        this.context.boundActionCreators.updateRotaShift({
            starts_at: this.state.newShiftTimes.starts_at,
            ends_at: this.state.newShiftTimes.ends_at,
            shift_id: this.props.shift.id
        });
    }
}
