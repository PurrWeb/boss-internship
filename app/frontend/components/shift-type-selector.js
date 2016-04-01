import React from "react"

export default class ShiftTypeSelector extends React.Component {
    static propTypes = {
        shiftType: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func.isRequired
    }
    render(){
        var isStandby = this.props.shiftType === "standby";
        return <label style={{fontWeight: "normal"}}>
            <input
                type="checkbox"
                checked={isStandby}
                onChange={(e) => {
                    var shiftType = e.target.checked ? "standby" : "normal";
                    this.props.onChange(shiftType);
                }} /> Standby
        </label>
    }
}