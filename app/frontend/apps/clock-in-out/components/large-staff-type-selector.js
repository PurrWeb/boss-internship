import React from "react"

class StaffTypeButton extends React.Component {
    render(){
        var { staffType } = this.props;
        return <div
            onClick={() => this.props.onClick()}
            className="large-staff-type-selector__button"
            style={{backgroundColor: staffType.color}}>
            {staffType.name}
        </div>
    }
}

export default class LargeStaffTypeSelector extends React.Component {
    static propTypes = {
        staffTypes: React.PropTypes.object.isRequired,
        onSelect: React.PropTypes.func.isRequired
    }
    render(){
        var staffTypeButtons = _.values(this.props.staffTypes).map((staffType) => {
            return <StaffTypeButton
                key={staffType.clientId}
                staffType={staffType}
                onClick={() => this.props.onSelect({staffType})} />
        });

        return <div style={{overflow: "hidden"}}>
            {staffTypeButtons}
        </div>
    }
}
