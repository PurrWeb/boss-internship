import React, { Component } from "react"
import ShiftTimeSelector from "~components/shift-time-selector"
import Spinner from "~components/spinner"
import RotaDate from "~lib/rota-date"
import validation from "~lib/validation"
import utils from "~lib/utils"
import { connect } from "react-redux"
import _ from "underscore"
import ComponentErrors from "~components/component-errors"

class ShiftEditor extends Component {
    static contextTypes = {
        boundActionCreators: React.PropTypes.object,
        dateOfRota: React.PropTypes.instanceOf(Date)
    }
    componentWillMount(){
        this.componentId = _.uniqueId();
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

        var updateButton = <a
            className={updateButtonClasses.join(" ")}
            onClick={() => this.updateShift()} style={{marginTop: "-4px"}}>
            Update
        </a>

        var spinner = null;
        if (this.props.shift.isBeingEdited) {
            spinner = <Spinner />
            updateButton = null;
        }

        if (this.props.componentErrors[this.componentId]){
            var componentErrors = <div style={{marginTop: 10}}>
                 <ComponentErrors errors={this.props.componentErrors[this.componentId]} />
            </div>
        }

        return <div>
            <div className="row">
                <div className="col-md-9">
                    <ShiftTimeSelector
                        defaultShiftTimes={this.props.shift}
                        rotaDate={new RotaDate({dateOfRota: this.context.dateOfRota})}
                        onChange={(shiftTimes) => this.onShiftTimesChange(shiftTimes)}
                        dateOfRota={this.context.dateOfRota} />
                </div>
                <div className="col-md-3">
                    <br/>
                    {updateButton}
                    {spinner}
                </div>
            </div>
            {componentErrors}
        
            <a
                onClick={() => this.deleteShift()}
                className={this.props.shift.isBeingEdited ? "link-disabled" : ""}>
                Delete shift
            </a>
        </div>
    }
    areBothTimesValid(){
        var {starts_at, ends_at} = this.state.newShiftTimes;
        return validation.areShiftTimesValid(starts_at, ends_at);
    }
    deleteShift(){
        if (this.props.shift.isBeingEdited) {
            return;
        }
        this.context.boundActionCreators.deleteRotaShift({
            shift_id: this.props.shift.id,
            errorHandlingComponent: this.componentId
        });
    }
    onShiftTimesChange(shiftTimes) {
        this.setState({newShiftTimes: shiftTimes})
    }
    updateShift(){
        this.context.boundActionCreators.updateRotaShift({
            shift: {
                starts_at: this.state.newShiftTimes.starts_at,
                ends_at: this.state.newShiftTimes.ends_at,
                shift_id: this.props.shift.id
            },
            errorHandlingComponent: this.componentId
        });
    }
}

function mapStateToProps(state){
    return {
        componentErrors: state.componentErrors
    }
}

export default connect(mapStateToProps)(ShiftEditor);