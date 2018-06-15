import React, {Component} from "react"
import { connect } from "react-redux"
import utils from "~/lib/utils"
import StaffShiftList from "~/components/staff-shift-list"
import StaffTypeBadge from "~/components/staff-type-badge"
import ClockInStatusBadge from "~/components/clock-in-status-badge"
import ToggleStaffClockedInButton from "../components/toggle-staff-clocked-in-button"
import ToggleStaffOnBreakButton from "../components/toggle-staff-on-break-button"
import {
    selectClockInOutStaffListItemProps,
    selectClockInOutAppIsInManagerMode
} from "~/redux/selectors"
import actions from "~/redux/actions"
import Spinner from "~/components/spinner"
import ToolTip from '../components/tooltip';

class ClockInOutStaffListItem extends Component {
    state = {
        isChangeStatusTooltipActive: false,
        isChangeSettingsTooltipActive: false
    };
    changeStatusButtonId = '';
    changeSettingsButtonId = '';

    constructor(props){
        super(props);

        const randomNum = Math.floor(Math.random() * 1000000);
        this.changeStatusButtonId = `changeButton${randomNum}`;
        this.changeSettingsButtonId = `settingsButton${randomNum}`;
    }
    showChangeStatusTooltip(event) {
        event.preventDefault();
        this.setState({isChangeStatusTooltipActive: true})
    }
    hideChangeStatusTooltip() {
        this.setState({isChangeStatusTooltipActive: false})
    }
    showChangeSettingsTooltip(event) {
        event.preventDefault();
        this.setState({isChangeSettingsTooltipActive: true})
    }
    hideChangeSettingsTooltip() {
        this.setState({isChangeSettingsTooltipActive: false})
    }
    drawUserAvatar(url, status){
        const statusForClassName = status.toLowerCase().replace(/( |_)/g, '-');

        return (
            <div className={`info-table__user-avatar-container info-table__user-avatar-container_${statusForClassName}`}>
                <img src={url} className="info-table__user-avatar-image" />
            </div>
        );
    }
    drawChangeSettingsTooltip() {
        const toolTipStyle = {
            style: {
                position: 'absolute',
                top: '331px',
                left: '456px',
                padding: '0.6em 0.9em',
                backgroundColor: 'white',
                borderRadius: '5px',
                border: '1px solid #f2f2f2',
                boxShadow: '0 8px 40px rgba(0, 0, 0, 0.17)'
            },
            arrowStyle: {
                borderColor: '#f2f2f2'
            }
        };

        return (
            <ToolTip
                active={this.state.isChangeSettingsTooltipActive}
                position="bottom"
                tooltipTimeout={50}
                arrow="right"
                parent={`#${this.changeSettingsButtonId}`}
                group="change-settings"
                style={toolTipStyle}
                onBackgroundClick={this.hideChangeSettingsTooltip.bind(this)}
            >
                <div className="boss-context-menu__content">
                    <div className="boss-buttons-block boss-context-menu_adjust_buttons-block-small">
                        {this.getAddNoteButton()}
                        {this.getChangePinButton()}
                    </div>
                </div>
            </ToolTip>
        );
    }
    getStatusAfterClicking(currentStatus) {
        return {
            clocked_in: 'clocked_out',
            clocked_out: 'clocked_in',
            on_break: 'clocked_out',
        }[currentStatus];
    }
    getBreakStatusAfterClicking(currentStatus) {
        return {
            clocked_in: 'on_break',
            clocked_out: null,
            on_break: 'clocked_in'
        }[currentStatus];
    }
    onClockButtonClick(event) {
        event.preventDefault();

        this.updateClockInStatus({
            statusValue: this.getStatusAfterClicking(this.props.clockInDay.status),
            staffMemberObject: this.props.staff
        });
        this.setState({isChangeStatusTooltipActive: false})
    }
    onBreakButtonClick(event) {
        event.preventDefault();

        this.updateClockInStatus({
            statusValue: this.getBreakStatusAfterClicking(this.props.clockInDay.status),
            staffMemberObject: this.props.staff
        });
        this.setState({isChangeStatusTooltipActive: false})
    }
    stubClickHandler(event) {
        event.preventDefault();
    }
    getBreakButton() {
        const breakStatusAfterClick = this.getBreakStatusAfterClicking(this.props.clockInDay.status);

        if (breakStatusAfterClick === null) {
            return null;
        }

        const label = {
            clocked_in: 'End break',
            on_break: 'Go On Break'
        }[breakStatusAfterClick];

        return (
            <a className="boss-button boss-button_big boss-button_role_go-on-break boss-buttons-block_adjust_button"
               data-test-marker-toggle-staff-status
               onClick={this.onBreakButtonClick.bind(this)}
            >
                {label}
            </a>
        );
    }
    drawChangeStatusTooltip() {
        const toolTipStyle = {
            style: {
                position: 'absolute',
                top: '331px',
                left: '456px',
                padding: '1.6em 0.9em 1.3em 0.9em',
                backgroundColor: 'white',
                borderRadius: '5px',
                border: '1px solid #f2f2f2',
                boxShadow: '0 8px 40px rgba(0, 0, 0, 0.17)'
            },
            arrowStyle: {
                borderColor: '#f2f2f2'
            }
        };
        const toggleStaffOnBreakButton = this.props.userPermissions.toggleOnBreak ? <ToggleStaffOnBreakButton
            clockInDay={this.props.clockInDay}
            staffObject={this.props.staff}
            updateClockInStatusWithConfirmation={(options) => this.updateClockInStatus(options)} /> : null;

        const clockedStatus = this.props.clockInDay.status;
        const breakButton = this.getBreakButton();

        const clockInButton = clockedStatus === 'clocked_out' ? (
            <a
               className="boss-button boss-button_big boss-button_role_clock-in boss-buttons-block_adjust_button"
               data-test-marker-toggle-staff-status
               onClick={this.onClockButtonClick.bind(this)}
            >
                Clock in
            </a>
        ) : null;

        const clockOutButton = clockedStatus === 'clocked_out' ? null : (
            <a
               className="boss-button boss-button_big boss-button_role_clock-out boss-buttons-block_adjust_button"
               data-test-marker-toggle-staff-status
               onClick={this.onClockButtonClick.bind(this)}
            >
                Clock Out
            </a>
        );

        return (
            <ToolTip
                    active={this.state.isChangeStatusTooltipActive}
                    position="bottom"
                    tooltipTimeout={50}
                    arrow="right"
                    parent={`#${this.changeStatusButtonId}`}
                    group="change-status"
                    style={toolTipStyle}
                    onBackgroundClick={this.hideChangeStatusTooltip.bind(this)}
            >
                <div className="boss-context-menu__content">
                    <div className="boss-buttons-block">
                        {breakButton}
                        {clockInButton}
                        {clockOutButton}
                    </div>
                </div>
            </ToolTip>
        );
    }
    render(){
        const staffMember = this.props.staff;
        const clockInStatusValue = this.props.clockInDay.status;
        const rotaedShiftsColumn = (
            <StaffShiftList
                shifts={utils.indexByClientId(this.props.staffMemberShifts)}
                rotas={this.props.rotas}
                venues={this.props.venues} />
        );

        const statusToggleButtons = (
            <span
               className="info-table__change-user-status"
               onClick={this.showChangeStatusTooltip.bind(this)}
               id={this.changeStatusButtonId}
            >(change)</span>
        );

        return (
            <div className="info-table__tr test-staff-row">
                <div className="info-table__td">
                    {this.drawUserAvatar(staffMember.avatar_url, clockInStatusValue)}
                    <div className="info-table__user-info">
                        <div className="info-table__user-name">
                            {staffMember.first_name} {staffMember.surname}
                        </div>
                        <StaffTypeBadge
                            staffTypeObject={staffMember.staffType} />
                        {this.getManagerModeButton()}
                        {this.getSettingsButton()}
                    </div>
                </div>
                <div className="info-table__td">
                    {rotaedShiftsColumn}
                </div>
                {this.getClockInNotesList()}
                <div className="info-table__td">
                    {this.getClockInStatusBadge(this.props.staff.updateStatusInProgress, clockInStatusValue)}
                    {statusToggleButtons}
                </div>

                {this.drawChangeStatusTooltip()}
            </div>
        );
    }
    getClockInStatusBadge(updateStatusInProgress, clockInStatusValue) {
        if (updateStatusInProgress) {
            return <Spinner />;
        } else {
            return (
                <ClockInStatusBadge
                    clockInStatusValue={clockInStatusValue}
                    onClick={this.showChangeStatusTooltip.bind(this)}
                />
            );
        }
    }
    getStaffMemberStatusToggleButtons(){
        var staffMember = this.props.staff;
        if (staffMember.updateStatusInProgress) {
            return <Spinner />
        }

        var toggleOnBreakButton = null;
        if (this.props.userPermissions.toggleOnBreak){
            toggleOnBreakButton = <div style={{display: "inline-block", paddingLeft: 5}}>
                <ToggleStaffOnBreakButton
                    clockInDay={this.props.clockInDay}
                    staffObject={staffMember}
                    updateClockInStatusWithConfirmation={(options) => this.updateClockInStatus(options)} />
            </div>
        }
        return <div className="row" style={{marginRight: 0}}>
            <div style={{float: "right"}}>
                <ToggleStaffClockedInButton
                    clockInDay={this.props.clockInDay}
                    staffObject={staffMember}
                    updateClockInStatusWithConfirmation={(options) => this.updateClockInStatus(options)} />
                {toggleOnBreakButton}
            </div>

        </div>
    }
    getClockInNotesList(){
        if (!this.props.userPermissions.addNote) {
            return null;
        }

        const notes = this.props.clockInNotes.length ? (
            this.props.clockInNotes.map((noteData, idx) => {
                return <span
                    key={idx}
                    className="info-table__notes"
                    data-test-marker-clock-in-note
                >
                    {noteData.note}
                </span>;
            })
        ) : <div className="info-table__notes info-table_no-value">(none)</div>;

        return (
            <div className="info-table__td">
                {notes}
            </div>
        );
    }
    onClickAddNote(event) {
        event.preventDefault();

        this.props.addNote(
            this.props.staff,
            this.props.clockInDay
        );
        this.hideChangeSettingsTooltip();
    }
    getAddNoteButton(){
        if (!this.props.userPermissions.addNote) {
            return null;
        }
        if (this.props.addClockInNoteIsInProgress){
            return <Spinner />
        }

        return (
            <a href="#"
               className="boss-button boss-button_small boss-button_role_add-note boss-buttons-block_adjust_button"
               data-test-marker-add-note
               onClick={this.onClickAddNote.bind(this)}
            >
                Add Note
            </a>
        );
    }
    updateClockInStatus({statusValue, staffMemberObject}){
        var currentStatus = this.props.clockInDay.status;
        this.props.updateClockInStatusWithConfirmation({
            statusValue,
            staffMemberObject,
            currentStatus,
            at: new Date(),
            venueServerId: this.props.pageOptions.venue.serverId,
            date: this.props.pageOptions.dateOfRota
        })
    }
    onClickChangePin(event) {
        event.preventDefault();
        this.props.updateStaffMemberPin({
            staffMemberObject: this.props.staff
        });
        this.hideChangeSettingsTooltip();
    }
    getChangePinButton(){
        var staffMember = this.props.staff;
        if (!this.props.userPermissions.changePin) {
            return null;
        }

        if (staffMember.updatePinInProgress) {
            return <Spinner />
        }

        return (
            <a href="#"
               className="boss-button boss-button_small boss-button_role_change-pin boss-buttons-block_adjust_button"
               data-test-marker-change-pin-button
               onClick={this.onClickChangePin.bind(this)}
            >
                Change Pin
            </a>
        );
    }
    enterManagerMode(){
        this.props.enterManagerMode();
    }
    onEnterManagerModeClick(event){
        event.preventDefault();
        this.props.enterUserMode(this.props.staff.staffType.name, this.props.staff);
    }
    getSettingsButton() {
        if (!this.props.userIsManagerOrSupervisor) {
            return null;
        }

        return (
            <div
                id={this.changeSettingsButtonId}
                className="info-table__settings-sign info-table__user-info_adjust_settings-sign test-settings-sign"
                onClick={this.showChangeSettingsTooltip.bind(this)}
            >
                {this.drawChangeSettingsTooltip()}
            </div>
        );
    }
    getManagerModeButton(){
        var staffMember = this.props.staff;
        if (!staffMember.canEnterManagerMode || this.props.userIsManagerOrSupervisor) {
            return null;
        }
        if (staffMember.enterManagerModeInProgress){
            return <Spinner />;
        }

        return (
            <div
                className="boss-button boss-button_small boss-button_role_enter-manager-mode info-table_adjust_button-small"
                data-test-marker-enter-manager-mode
                onClick={this.onEnterManagerModeClick.bind(this)}
            >
                enter manager mode
            </div>
        );
    }
}

function mapDispatchToProps(dispatch){
    return {
        updateClockInStatusWithConfirmation: function(options){
            dispatch(actions().updateClockInStatusWithConfirmation(options))
        },
        enterUserMode: function(userMode, staffMemberObject){
            dispatch(actions().enterUserModeWithConfirmation({userMode, staffMemberObject}));
        },
        updateStaffMemberPin: function(options){
            dispatch(actions().updateStaffMemberPinWithEntryModal(options))
        },
        addNote: function(staffMemberObject, clockInDay){
            dispatch(actions().showAddNoteWindow(staffMemberObject.first_name, staffMemberObject.surname, staffMemberObject, clockInDay));
        }
    }
}

function mapStateToProps(state, ownProps) {
    const clockInOutStaffListItemProps = selectClockInOutStaffListItemProps(state, ownProps);
    const extendedProps = {
        userIsManagerOrSupervisor: selectClockInOutAppIsInManagerMode(state)
    };

    return Object.assign({}, clockInOutStaffListItemProps, extendedProps);
}

export default connect(mapStateToProps, mapDispatchToProps)(ClockInOutStaffListItem);
