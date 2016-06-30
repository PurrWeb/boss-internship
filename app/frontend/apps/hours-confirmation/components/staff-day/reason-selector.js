import React from "react"
import _ from "underscore"

export default class ReasonSelector extends React.Component {
    render(){
        var {reason, reasonNote, reasons} = this.props;

        var showTextArea = reason.note_required
        var sortedReason = _.chain(reasons)
            .values()
            .sortBy("rank")
            .value();

        var dropdown, dropdownSelectionString;
        if (this.props.readonly) {
            dropdownSelectionString = <div>
                {reason.title}
            </div>
        } else {
            dropdown = <select
                style={{marginBottom: 4}}
                value={reason.clientId}
                onChange={(e) => {
                    var reason;
                    var selectedValue = e.target.value;
                    this.triggerChange({
                        reason: reasons[selectedValue]
                    });
                }}>
                {sortedReason.map((reason) =>
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

        if (!newData.reason.note_required) {
            newData.reasonNote = "";
        }

        this.props.onChange(newData)
    }
}
