import React, { Component } from "react"
import { connect } from "react-redux"
import _ from "underscore"
import ClockInOutStaffFinder from "./staff-finder"
import actions from "~/redux/actions"
import {
    selectRotaOnClockInOutPage,
    selectLeaveManagerModeIsInProgress,
    selectClockInOutAppIsInManagerMode,
    selectClockInOutAppUserPermissions
} from "~/redux/selectors"
import ConfirmationModal from "~/components/confirmation-modal"
import LargeStaffTypeSelector from "../components/large-staff-type-selector"
import getStaffTypesWithStaffMembers from "~/lib/get-staff-types-with-staff-members"
import Header from "../components/header"
import LoadAppDataDialog from "./load-app-data-dialog"
import Clock from "../components/clock"

class ClockInOutView extends Component {
    defaultClassNameOfMain = ''; // to prevent collisions between new and old styles
    mainTag = null; // the <main> tag of the app

    constructor(){
        super();
        this.onReloadClick = this.onReloadClick.bind(this);
    }
    componentDidMount() {
        this.mainTag = document.querySelector('main');

        document.body.classList.add('boss-body');

        if (this.mainTag) {
            this.defaultClassNameOfMain = this.mainTag.className;
            this.mainTag.className = 'boss-root';
        }
    }
    componentWillUnmount() {
        document.body.classList.remove('boss-body');

        if (this.mainTag) {
            this.mainTag.className = this.defaultClassNameOfMain;
        }
    }
    render() {
        this.setMainTagClass();

        if (!this.props.hasLoadedAppData) {
            return (
                <div className="boss-page-content__inner-container">
                    <div className="boss-page-wrapper">
                        <LoadAppDataDialog />
                    </div>
            </div>)
        } else {
            return this.getClockInOutUI();
        }
    }
    onReloadClick(event){
        event.preventDefault();
        location.reload()
    }
    getReloadPageButton(){
        return (
            <button
               className="boss-header__reload-button"
               onClick={this.onReloadClick}
            >
                Reload
            </button>
        );
    }
    setMainTagClass() {
        if (!this.mainTag) {
            return;
        }

        if (this.props.userIsManagerOrSupervisor) {
            this.mainTag.classList.add('boss-root_role_manager');
            this.mainTag.classList.remove('boss-root_role_normal');
        } else {
            this.mainTag.classList.add('boss-root_role_normal');
            this.mainTag.classList.remove('boss-root_role_manager');
        }
    }
    getClockInOutUI(){
        const resetVenueFn = this.props.userPermissions.resetVenue ? this.resetVenue.bind(this) : null;
        let header = null;
        let content = null;

        if (this.props.selectedStaffTypeClientId !== null) {
            header = (
                <Header
                        returnToStaffTypeSelector={()=> this.props.selectStaffType(null)}
                        userIsManager={this.props.userIsManager}
                        userIsSupervisor={this.props.userIsSupervisor}
                        userIsManagerOrSupervisor={this.props.userIsManagerOrSupervisor}
                        leaveManagerModeInProgress={this.props.leaveManagerModeInProgress}
                        leaveManagerMode={this.props.leaveManagerMode}
                        venue={this.props.venue}
                        rota={this.props.rota}
                        reloadPage={() => location.reload()}
                />
            );
            content = <ClockInOutStaffFinder
                selectedStaffTypeClientId={this.props.selectedStaffTypeClientId}
                userIsManagerOrSupervisor={this.props.userIsManagerOrSupervisor}
                resetVenue={resetVenueFn}
            />;
        } else {
            header = (
                <div className="boss-header__container">
                    <div className="boss-header">
                        <div className="boss-header__reload-cell">
                            {this.getReloadPageButton()}
                        </div>
                        <div className="boss-header__caption-cell">
                            <div className="boss-header__caption-text">Select Your Staff Type</div>
                        </div>
                        <div className="boss-header__time-cell">
                            <Clock />
                        </div>
                    </div>
                </div>
            );
            content = (
                <LargeStaffTypeSelector
                    staffTypes={this.props.staffTypes}
                    onSelect={({staffType}) => this.props.selectStaffType(staffType.clientId)} />
            );
        }

        return (
            <div className="boss-page-content__inner-container">
                <div className="boss-page-wrapper">
                    <ConfirmationModal />
                    {header}
                    <div className="boss-main-content">
                        {content}
                    </div>
                </div>
            </div>
        );

    }
    resetVenue(event){
        event.preventDefault();
        var message = "You'll have to re-enter the venue key after resetting the venue." +
            "\n\nDo you want to continue?"
        if (!confirm(message)){
            return;
        }
        this.props.resetApiKey();
    }
}

function mapStateToProps(state) {
    if (_.values(state.staffMembers).length === 0) {
        return {hadLoadedAppData: false};
    }
    var rota = selectRotaOnClockInOutPage(state);
    return {
        hasLoadedAppData: true,
        userIsManagerOrSupervisor: selectClockInOutAppIsInManagerMode(state),
        rota,
        apiKey: state.apiKey,
        staffMembers: state.staffMembers,
        leaveManagerModeInProgress: selectLeaveManagerModeIsInProgress(state),
        venue: rota.venue.get(state.venues),
        staffTypes: getStaffTypesWithStaffMembers(state.staffTypes, state.staffMembers),
        selectedStaffTypeClientId: state.clockInOutAppSelectedStaffType,
        userPermissions: selectClockInOutAppUserPermissions(state),
    }
}

function mapDispatchToProps(dispatch){
    return {
        leaveManagerMode: function(){
            dispatch(actions().clockInOutAppEnterUserMode({
                userMode: "User"
            }))
        },
        selectStaffType: function(selectedStaffTypeClientId){
            dispatch(actions().clockInOutAppSelectStaffType({
                selectedStaffTypeClientId
            }))
        },
        resetApiKey: function(){
            // reset store also updates the apiKey, which means it'll
            // be updated in localStorage
            dispatch(actions().resetStore());
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ClockInOutView);
