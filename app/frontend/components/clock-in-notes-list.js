import React from "react"

export default class ClockInNotesList extends React.Component {
    render(){
        if (this.props.notes.length === 0) {
            return <div style={{color: "#999"}}>(None)</div>
        }
        return  <ul style={{paddingLeft: 20}}>
                {this.props.notes.map((note) =>
                    <li key={note.clientId}>{note.note}</li>
                )}
            </ul>
    }
}
