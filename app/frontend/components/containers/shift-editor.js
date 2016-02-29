import React, { Component } from "react"
import ShiftTimeSelector from "~components/shift-time-selector"
import Spinner from "~components/spinner"
import RotaDate from "~lib/rota-date"
import validation from "~lib/validation"
import utils from "~lib/utils"
import { connect } from "react-redux"
import { deleteRotaShift, updateRotaShift } from "~redux/actions"
import _ from "underscore"
import ComponentErrors from "~components/component-errors"

class ShiftEditor extends Component {
    static propTypes = {
        shift: React.PropTypes.object.isRequired
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
                        onChange={(shiftTimes) => this.onShiftTimesChange(shiftTimes)} />
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
        this.props.deleteRotaShift({
            shift: this.props.shift,
            venueId: this.props.venueId,
            errorHandlingComponent: this.componentId,
        });
    }
    onShiftTimesChange(shiftTimes) {
        this.setState({newShiftTimes: shiftTimes})
    }
    updateShift(){
        this.props.updateRotaShift({
            venueId: this.props.venueId,
            shift: {
                starts_at: this.state.newShiftTimes.starts_at,
                ends_at: this.state.newShiftTimes.ends_at,
                shift_id: this.props.shift.id
            },
            errorHandlingComponent: this.componentId
        });
    }
}

function mapStateToProps(state, ownProps){
    var rotaId = ownProps.shift.rota.id;
    var rota = state.rotas[rotaId];
    return {
        componentErrors: state.componentErrors,
        venueId: rota.venue.id
    }
}

function mapDispatchToProps(dispatch){
    return {
        updateRotaShift: (options) => dispatch(updateRotaShift(options)),
        deleteRotaShift: (options) => dispatch(deleteRotaShift(options))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShiftEditor);