import React from "react"

export default class ClockInNotesList extends React.Component {
    render(){
        if (!this.props.notes) {
            return <div>(None)</div>
        }
        return  <ul style={{paddingLeft: 20}}>
                {this.props.notes.map((note) =>
                    <li key={note.clientId}>{note.note}</li>
                )}
            </ul>
    }
}
