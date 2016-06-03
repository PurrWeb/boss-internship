import React from "react"

export default class ReasonSelector extends React.Component {
    render(){
        var {reason, reasonNote, reasons} = this.props;
        var reasonIsSelected = reason !== null;

        var showTextArea = reasonIsSelected && reason.title === "Other";

        var dropdown, dropdownSelectionString;
        if (this.props.readonly) {
            dropdownSelectionString = <div>
                {reason.title}
            </div>
        } else {
            dropdown = <select
                style={{marginBottom: 4}}
                value={reasonIsSelected ? reason.clientId : noneSelectedId}
                onChange={(e) => {
                    var reason;
                    var selectedValue = e.target.value;
                    this.triggerChange({
                        reason: reasons[selectedValue]
                    });
                }}>
                {_.values(reasons).map((reason) =>
                    <option value={reason.clientId} key={reason.clientId}>
                        {reason.text}
                    </option>
                )}
            </select>
        }

        return <div>
            {dropdown}
            {dropdownSelectionString}
            <textarea
                onChange={(e) => {
                    if (this.props.readonly) {
                        return;
                    }
                    this.triggerChange({
                        reasonNote: e.target.value
                    })
                }}
                readOnly={this.props.readonly}
                style={{display: showTextArea ? "block" : "none"}}
                value={reasonNote} />
        </div>
    }
    triggerChange(dataToUpdate){
        var newData = {
            reason: this.props.reason,
            reasonNote: this.props.reasonNote
        }
        _.extend(newData, dataToUpdate);

        this.props.onChange(newData)
    }
}
