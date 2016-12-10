import React from "react"
import moment from "moment"
import LeaveManagerModeButton from "./leave-manager-mode-button"

export default class Header extends React.Component {
    static propTypes = {
        returnToStaffTypeSelector: React.PropTypes.func.isRequired,
        userIsManagerOrSupervisor: React.PropTypes.bool.isRequired,
        leaveManagerModeInProgress: React.PropTypes.bool.isRequired,
        leaveManagerMode: React.PropTypes.func.isRequired,
        reloadPage: React.PropTypes.func.isRequired,
        venue: React.PropTypes.object.isRequired,
        rota: React.PropTypes.object.isRequired
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
            <div className="header__select-type-cell">
                <a href="#"
                   className="header__select-type-text"
                   onClick={this.onClickReturnToStaffTypeSelector}
                >
                    Select a Different Staff Type
                </a>
            </div>
        );
        const leaveManagerModeCell = userIsManagerOrSupervisor ? (
            <div className="header__leave-manager-mode-cell">
                <LeaveManagerModeButton
                    leaveManagerModeInProgress={this.props.leaveManagerModeInProgress}
                    leaveManagerMode={this.props.leaveManagerMode} />
            </div>
        ) : null;

        const reloadPageButton = (
            <a href="#"
               className="header__reload-button"
               onClick={this.onClickReload}
            >
                Reload
            </a>
        );

        return (
            <div className="header__container">
                <div className="header">
                    {returnToStaffTypeSelectorCell}
                    {leaveManagerModeCell}
                    <div className="header__name-cell">
                        <div className="header__name">{this.props.venue.name}</div>
                        <div className="header__date">{moment(this.props.rota.date).format("ddd D MMMM YYYY")}</div>
                    </div>
                    <div className="header__reload-cell">
                        {reloadPageButton}
                    </div>
                </div>
            </div>
        );
    }
}
