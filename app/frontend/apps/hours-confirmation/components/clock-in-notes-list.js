import React from "react"

export default class ClockInNotesList extends React.Component {
    render(){
      return <div className="boss-notes boss-notes_page_hrc">
        <h4 className="boss-notes__label"> Notes </h4>
        <div className="boss-notes__content">
          <div className="boss-notes__content-inner">
          </div>
          <ul className="boss-notes__list">
              {this.props.notes.map((note) =>
                  <li className="notes__item"
                      data-test-marker-clock-in-note
                      key={note.clientId}>
                      <a href="::javascript" className="boss-notes__link"> {note.note} </a>
                  </li>
              )}
          </ul>
        </div>
    </div>
    }
}
