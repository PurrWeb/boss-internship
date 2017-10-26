import PropTypes from 'prop-types';
import React, { Component } from "react"
import ShiftTimeSelector from "~/components/shift-time-selector"
import Spinner from "~/components/spinner"
import RotaDate from "~/lib/rota-date"
import validation from "~/lib/validation"
import utils from "~/lib/utils"
import { connect } from "react-redux"
import actionCreators from "~/redux/actions"
import _ from "underscore"
import ComponentErrors from "~/components/component-errors"
import getStaffTypeFromShift from "~/lib/get-staff-type-from-shift"
import { canEditStaffTypeShifts, selectShiftIsBeingEdited } from "~/redux/selectors"
import ShiftTypeSelector from "~/components/shift-type-selector"
import cx from 'classnames';

class ShiftEditorUi extends Component {
    render(){
        if (this.props.shift == null) {
            return <div />
        }

        return <div>
            <div className="row">
                <div className="column">
                    <ShiftTimeSelector
                        rotaDate={this.props.rotaDate}
                        defaultShiftTimes={this.props.shift}
                        onChange={this.props.onShiftTimesChange} />
                    <ShiftTypeSelector
                        shiftType={this.props.shiftType}
                        onChange={this.props.onShiftTypeChange}/>
                </div>
                <div className="shrink column">
                    <br/>
                    {this.getUpdateButton()}
                    {this.getDeleteButton()}
                    {this.getSpinner()}
                </div>
            </div>
            {this.getComponentErrors()}
        </div>
    }
    getUpdateButton(){
        var updateButtonClasses = ["boss2-button"];
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
        const className = cx('boss2-button boss2-button_role_exclamation', {disabled: this.props.shiftIsBeingEdited});
        return <a
            onClick={this.props.deleteShift}
            className={className}>
            Delete
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
        shift: PropTypes.object.isRequired
    }
    componentWillMount(){
        this.componentId = _.uniqueId();
    }
    constructor(props){
        super(props);
        var {starts_at, ends_at, shift_type} = props.shift;
        this.state = {
            newShiftTimes: {
                starts_at, ends_at
            },
            shiftType: shift_type
        }
    }
    render(){
        var updatedShift = Object.assign({}, this.props.shift, this.state.newShiftTimes)
        return <ShiftEditorUi
            shift={updatedShift}
            rotaDate={this.getRotaDate()}
            errors={this.props.componentErrors[this.componentId]}
            canEditShift={this.props.canEditShift}
            updateShift={() => this.updateShift()}
            deleteShift={() => this.deleteShift()}
            areBothTimesValid={this.areBothTimesValid()}
            shiftIsBeingEdited={this.props.shiftIsBeingEdited}
            onShiftTimesChange={(newShiftTimes) => this.setState({newShiftTimes})}
            shiftType={this.state.shiftType}
            onShiftTypeChange={(shiftType) => this.setState({shiftType})} />
    }
    deleteShift(){
        if (this.props.shiftIsBeingEdited) {
            return;
        }
        this.props.deleteRotaShift({
            shift: this.props.shift,
            venueClientId: this.props.venueClientId,
            errorHandlingId: this.componentId,
        });
    }
    updateShift(){
        var { newShiftTimes } = this.state;
        var { shift } = this.props;
        this.props.updateRotaShift({
            venueClientId: this.props.venueClientId,
            starts_at: newShiftTimes.starts_at,
            ends_at: newShiftTimes.ends_at,
            shiftServerId: shift.serverId,
            shiftClientId: shift.clientId,
            errorHandlingId: this.componentId,
            shiftType: this.state.shiftType
        });
    }
    areBothTimesValid(){
        var {starts_at, ends_at} = this.state.newShiftTimes;
        return validation.areShiftTimesValid(starts_at, ends_at);
    }
    getRotaDate(){
        return new RotaDate({dateOfRota: this.props.dateOfRota})
    }
}

function mapStateToProps(state, ownProps){
    var rota = ownProps.shift.rota.get(state.rotas)
    var staffType = getStaffTypeFromShift({
        shift: ownProps.shift,
        staffMembersById: state.staffMembers,
        staffTypesById: state.staffTypes
    });
    return {
        componentErrors: state.componentErrors,
        venueClientId: rota.venue.clientId,
        canEditShift: canEditStaffTypeShifts(state, {staffTypeClientId: staffType.clientId}),
        shiftIsBeingEdited: selectShiftIsBeingEdited(state, {shiftServerId: ownProps.shift.serverId}),
        dateOfRota: rota.date
    }
}

function mapDispatchToProps(dispatch){
    return {
        updateRotaShift: (options) => dispatch(actionCreators().updateRotaShift(options)),
        deleteRotaShift: (options) => dispatch(actionCreators().deleteRotaShift(options))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShiftEditor);
