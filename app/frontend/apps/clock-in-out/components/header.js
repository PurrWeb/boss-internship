import PropTypes from 'prop-types';
import React from "react"
import safeMoment from "~/lib/safe-moment"
import LeaveManagerModeButton from "./leave-manager-mode-button"

export default class Header extends React.Component {
    static propTypes = {
        returnToStaffTypeSelector: PropTypes.func.isRequired,
        userIsManagerOrSupervisor: PropTypes.bool.isRequired,
        leaveManagerModeInProgress: PropTypes.bool.isRequired,
        leaveManagerMode: PropTypes.func.isRequired,
        reloadPage: PropTypes.func.isRequired,
        venue: PropTypes.object.isRequired,
        rota: PropTypes.object.isRequired
    };
    constructor(){
        super();
        this.onClickReload = this.onClickReload.bind(this);
        this.onClickReturnToStaffTypeSelector = this.onClickReturnToStaffTypeSelector.bind(this);
    }
    onClickReload(event){
        event.preventDefault();
        this.props.reloadPage();
    }
    onClickReturnToStaffTypeSelector(event){
        event.preventDefault();
        this.props.returnToStaffTypeSelector();
    }
    render(){
        const {userIsManagerOrSupervisor} = this.props;
        const returnToStaffTypeSelectorCell = userIsManagerOrSupervisor ? null : (
            <div className="boss-header__select-type-cell">
                <button
                   className="boss-header__select-type-text"
                   onClick={this.onClickReturnToStaffTypeSelector}
                >
                    Select a Different Staff Type
                </button>
            </div>
        );
        const leaveManagerModeCell = userIsManagerOrSupervisor ? (
            <div className="boss-header__leave-manager-mode-cell">
                <LeaveManagerModeButton
                    leaveManagerModeInProgress={this.props.leaveManagerModeInProgress}
                    leaveManagerMode={this.props.leaveManagerMode} />
            </div>
        ) : null;

        const reloadPageButton = (
            <button
               className="boss-header__reload-button"
               onClick={this.onClickReload}
            >
                Reload
            </button>
        );

        return (
            <div className="boss-header__container">
                <div className="boss-header">
                    {returnToStaffTypeSelectorCell}
                    {leaveManagerModeCell}
                    <div className="boss-header__name-cell">
                        <div className="boss-header__name">{this.props.venue.name}</div>
                        <div className="boss-header__date">{safeMoment.uiDateParse(this.props.rota.date).format("ddd D MMMM YYYY")}</div>
                    </div>
                    <div className="boss-header__reload-cell">
                        {reloadPageButton}
                    </div>
                </div>
            </div>
        );
    }
}
