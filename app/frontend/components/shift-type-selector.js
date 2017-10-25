import PropTypes from 'prop-types';
import React from "react"

export default class ShiftTypeSelector extends React.Component {
    static propTypes = {
        shiftType: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired
    }
    render(){
        var isStandby = this.props.shiftType === "standby";
        return <label>
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