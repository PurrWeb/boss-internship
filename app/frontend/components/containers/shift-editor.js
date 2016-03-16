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
import getStaffTypeFromShift from "~lib/get-staff-type-from-shift"
import { canEditStaffTypeShifts, selectShiftIsBeingEdited } from "~redux/selectors"

class ShiftEditorUi extends Component {
    render(){
        if (this.props.shift == null) {
            return <div />
        }

        return <div>
            <div className="row">
                <div className="col-md-9">
                    <ShiftTimeSelector
                        defaultShiftTimes={this.props.shift}
                        onChange={this.props.onShiftTimesChange} />
                </div>
                <div className="col-md-3">
                    <br/>
                    {this.getUpdateButton()}
                    {this.getSpinner()}
                </div>
            </div>
            {this.getComponentErrors()}
        
            {this.getDeleteButton()}
        </div>
    }
    getUpdateButton(){
        var updateButtonClasses = ["btn", "btn-primary"];
        if (!this.props.areBothTimesValid) {
            updateButtonClasses.push("disabled");
        }

        var updateButton = null;
        if (this.props.canEditShift){
            updateButton = <a
                className={updateButtonClasses.join(" ")}
                onClick={this.props.updateShift} style={{marginTop: "-4px"}}>
                Update
            </a>
        }

        if (this.props.shiftIsBeingEdited){
            updateButton = null;
        }

        return updateButton;
    }
    getDeleteButton(){
        if (!this.props.canEditShift) {
            return null;
        }
        return <a
            onClick={this.props.deleteShift}
            className={this.props.shiftIsBeingEdited ? "link-disabled" : ""}>
            Delete shift
        </a>
    }
    getComponentErrors(){
        if (this.props.errors){
            return <div style={{marginTop: 10}}>
                 <ComponentErrors errors={this.props.errors} />
            </div>
        }
        return null;
    }
    getSpinner(){
        if (this.props.shiftIsBeingEdited) {
            return <Spinner />
        }
        return null;
    }
}

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
        return <ShiftEditorUi
            shift={this.props.shift}
            errors={this.props.componentErrors[this.componentId]}
            canEditShift={this.props.canEditShift}
            updateShift={() => this.updateShift()}
            deleteShift={() => this.deleteShift()}
            areBothTimesValid={this.areBothTimesValid()}
            shiftIsBeingEdited={this.props.shiftIsBeingEdited}
            onShiftTimesChange={(newShiftTimes) => this.setState({newShiftTimes})} />
    }
    deleteShift(){
        if (this.props.shiftIsBeingEdited) {
            return;
        }
        this.props.deleteRotaShift({
            shift: this.props.shift,
            venueId: this.props.venueId,
            errorHandlingComponent: this.componentId,
        });
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
    areBothTimesValid(){
        var {starts_at, ends_at} = this.state.newShiftTimes;
        return validation.areShiftTimesValid(starts_at, ends_at);
    }
}

function mapStateToProps(state, ownProps){
    var rotaClientId = ownProps.shift.rota.clientId;
    var rota = state.rotas[rotaClientId];
    var staffType = getStaffTypeFromShift({
        shift: ownProps.shift,
        staffMembersById: state.staff,
        staffTypesById: state.staffTypes
    });
    return {
        componentErrors: state.componentErrors,
        venueId: rota.venue.id,
        canEditShift: canEditStaffTypeShifts(state, {staffTypeClientId: staffType.clientId}),
        shiftIsBeingEdited: selectShiftIsBeingEdited(state, {shiftId: ownProps.shift.id})
    }
}

function mapDispatchToProps(dispatch){
    return {
        updateRotaShift: (options) => dispatch(updateRotaShift(options)),
        deleteRotaShift: (options) => dispatch(deleteRotaShift(options))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShiftEditor);