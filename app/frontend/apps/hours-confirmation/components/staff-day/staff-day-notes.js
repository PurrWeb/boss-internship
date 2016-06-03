import React from "react"

export default class StaffDayNotes extends React.Component {
    render(){
        return <div>
            <div className="staff-day__sub-heading">Notes</div>
            <ul style={{paddingLeft: 20}}>
                {this.props.notes.map((note) =>
                    <li key={note.clientId}>{note.text}</li>
                )}
            </ul>
        </div>
    }
}
