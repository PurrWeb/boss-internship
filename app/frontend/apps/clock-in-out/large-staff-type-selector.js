import React from "react"

class StaffTypeButton extends React.Component {
    render(){
        return <div onClick={() => this.props.onClick()}>
            {this.props.staffType.name}
        </div>
    }
}

export default class LargeStaffTypeSelector extends React.Component {
    static propTypes = {
        staffTypes: React.PropTypes.object.isRequired,
        onSelect: React.PropTypes.func.isRequired
    }
    render(){
        setTimeout(() => {
            this.props.onSelect({staffType: _.first(this.props.staffTypes)})
        }, 2000);

        var staffTypeButtons = _.values(this.props.staffTypes).map((staffType) => {
            return <StaffTypeButton
                key={staffType.clientId}
                staffType={staffType}
                onClick={() => this.props.onSelect({staffType})} />
        });

        return <div>
            {staffTypeButtons}
        </div>
    }
}