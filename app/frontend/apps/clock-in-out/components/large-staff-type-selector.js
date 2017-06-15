import React from "react"
import _ from "underscore"
import UserActionConfirmationMessages from "~components/user-action-confirmation-messages"

class StaffTypeButton extends React.Component {
    constructor(){
        super();
        this.onClick = this.onClick.bind(this);
    }
    onClick(event){
        event.preventDefault();
        this.props.onClick()
    }
    render(){
        const staffType = this.props.staffType;
        const name = staffType.name.toLowerCase();
        const fixedName = name.replace(' ', '-');

        return (
            <div
                    className={`main-menu__button test-main-menu-staff-button`}
                    style={{backgroundColor: staffType.color}}
                    onClick={this.onClick}
            >
                <a href="#"
                   className="main-menu__button-text"
                >
                    {name}
                </a>
            </div>
        );
    }
}

export default class LargeStaffTypeSelector extends React.Component {
    static propTypes = {
        staffTypes: React.PropTypes.object.isRequired,
        onSelect: React.PropTypes.func.isRequired
    };
    render(){
        const buttonsInRow = 3;
        const staffTypesBlocks = _.groupBy(_.values(this.props.staffTypes), (element, index) => {
            return Math.floor(index/buttonsInRow);
        });

        const staffTypeRows = _.values(staffTypesBlocks).map((staffBlock, idx) => {
            const buttons = staffBlock.map((staffType, staffIdx) => {
                return (
                    <StaffTypeButton
                        key={staffIdx}
                        staffType={staffType}
                        onClick={() => this.props.onSelect({staffType})} />
                );
            });

            return (
                <div className="main-menu__row" key={idx}>
                    {buttons}
                </div>
            );
        });

        return (
            <div className="main-content__body">
                <div className="main-menu main-content__body_adjust_main-menu">
                    <UserActionConfirmationMessages />
                    {staffTypeRows}
                </div>
            </div>
        );
    }
}
